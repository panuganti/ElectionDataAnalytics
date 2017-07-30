import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { ColorProvider } from '../../providers/color';
import * as Enumerable from 'linq';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

declare var d3;
declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DataProvider, ColorProvider]
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  geoJson: any;
  boothGeoJson: any;
  styleMaps: any;
  results: any[];
  years: string[];
  loading: Loading;
  acResults: CandidateVote[];

  showLegend: boolean = true;
  showAcResults: boolean = false;
  showCasteBreakup: boolean = false;
  showAcName: boolean = false;
  showMapSettings: boolean = true;
  showSummary: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: DataProvider, public color: ColorProvider, public loadingCtrl: LoadingController,
    public zone: NgZone, public afAuth: AngularFireAuth) {
    let email = window.localStorage.getItem('email');
    if (!email) {
      this.navCtrl.setRoot('LoginPage');
    }
  }

  showResults(id: string) {
    if (Enumerable.from(this.results).any(r => r.Id == id)) {
      let acResult = Enumerable.from(this.results).first(r => r.Id == id);
      this.acResults = acResult.Votes;
      this.showAcResults = true;
    }
  }

  async ionViewDidLoad() {
    await this.loadMap();
  }

  signOut() {
    window.localStorage.removeItem('email');
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

  async loadMap() {
    this.showLoading();
    let latLng = new google.maps.LatLng(12.96, 77.59);
    let mapOptions = { center: latLng, zoom: 7 };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.setMapTypeId('terrain');
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.dismissLoading();
    });
  }

  async loadGeoJson() {
    //this.boothGeoJson = await this.data.getBoothJson();
    if (this.electionYear < 2008) {
      this.geoJson = await this.data.getPreDelimGeoJson();
    }
    else {
      this.geoJson = await this.data.getGeoJson();
    }
    this.map.data.addGeoJson(this.geoJson);
    this.map.data.addListener('click', (event) => { this.zone.run(() => this.acClicked(event)) })
  }

  async loadResults() {
    this.showSummary = true;
    this.results = await this.data.getResults(this.electionYear.toString(), 'ac');
    this.styleMaps = this.GenerateStyleMaps(this.results);
    let styleMaps: any = Enumerable.from(this.styleMaps);
    this.map.data.setStyle((feature) => {
      var id;
      if (this.electionYear > 2008) {
        id = feature.getProperty('ac');
      }
      else {
        id = feature.getProperty('AC_NO');
      }
      if (styleMaps.any(t => t.Id == id)) {
        var style = styleMaps.first(t => t.Id == id).Style;
        style.fillOpacity = this.transparency / 100;
        return style;
      }
      return {
        strokeWeight: 0.5,
        fillOpacity: this.transparency / 100,
        strokeOpacity: 0.5,
        fillColor: this.color.getColor("black", Math.floor(Math.random() * (100 - 25 + 1)) + 25, 0, 100, 9),
        title: id
      };
    })
  }

  async redraw() {
    this.loadMap();
    await this.loadGeoJson();
    await this.loadResults();
  }

  electionYear: any = 2014;
  mapType: string = 'ac';
  margins: boolean = true;
  selectedAC: number;
  selectedWard: string;
  acBreakdown: boolean = true;

  async changeSettingsAndRedraw(ev: any) {
    this.transparency = ev.transparency;
    this.electionYear = ev.electionYear;
    this.mapType = ev.mapType;
    this.margins = ev.margins;
    this.selectedAC = ev.selectedAC;
    this.selectedWard = ev.selectedWard;
    this.acBreakdown = ev.acBreakdown;
    await this.redraw();
  }

  /*
    async showBoothResultsOnMap(year: number) {
      var results: Result[] = await this.data.getBoothResults(year);
      var styleMaps = this.color.GenerateBoothStyleMaps(results);
  
      let styleMapsEn = Enumerable.from(styleMaps);
      this.map.setStyle(function (feature) {
        let id = feature.getProperty('ac');
        return styleMapsEn.first(t => t.Id == id).Style;
      });
    }  
  */
  booths: any[];

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading Map...'
    });
    this.loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }

  async setBoothMap() {
    let latLng = new google.maps.LatLng(12.96, 77.59);
    let mapOptions = { center: latLng, zoom: 7 };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.setMapTypeId('terrain');

    var lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
      strokeColor: '#393'
    };

    this.boothGeoJson.features.forEach(element => {
      //      let id = element.properties.pc;
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(element.geometry.coordinates[1], element.geometry.coordinates[0]),
        icon: lineSymbol
      });
      marker.setMap(this.map);
    });
  }

  acName: string = '';
  acClicked(event: any) {
    this.showAcName = true;
    this.acName = event.feature.getProperty('ac_name');
    this.showResults(event.feature.getProperty('ac'));
  }


  transparency: number = 70;
  visibility: boolean = true;

  public GenerateStyleMaps(acResults: Result[]): any[] {
    let en = Enumerable.from(acResults);
    let acStyleMaps: any[] = [];
    let self = this;
    en.forEach(element => {
      let votes = Enumerable.from(en.where(t => t.Id == element.Id).first().Votes)
      let party = votes.first(t => t.Position == 1).Party;
      let partyColor = self.getColor(party);
      let styleMap: AcStyleMap = { Id: -1, Style: {} };
      styleMap.Style = self.defaultStyle;
      styleMap.Id = element.Id;
      let totalVotes = votes.select(t => t.Votes).toArray().reduce((a, b) => a + b);
      let margin = votes.first(t => t.Position == 1).Votes - votes.first(t => t.Position == 2).Votes;
      var marginPercent;
      if (this.margins) {
        marginPercent = Math.ceil((margin) * 100 / totalVotes);
      }
      else {
        marginPercent = 10;
      }
      let color = self.color.getColor(partyColor, marginPercent + 5, 0, 25);
      styleMap.Style = {
        strokeWeight: self.defaultStyle.strokeWeight,
        fillOpacity: self.defaultStyle.fillOpacity,
        strokeOpacity: self.defaultStyle.strokeOpacity,
        fillColor: color
      }
      acStyleMaps.push(styleMap);
      //      debugger;
    });
    return acStyleMaps;
  }


  getColor(party: string) {
    if (this.colorMap[party.toLowerCase()] != undefined) {
      return this.colorMap[party.toLowerCase()];
    }
    return "black";
  }

  colorMap: any = {
    "bjp": "orange",
    "inc": "blue",
    "jds": "green",
    "others": "black",
    "bharatiya janta party": "orange",
    "indian national congress": "blue",
    "janata dal (secular)": "green"
  }

  defaultStyle: any = {
    strokeWeight: 1,
    fillOpacity: 0.9,
    strokeOpacity: 0.3,
    strokeColor: "white"
  };
}

export interface AcStyleMap {
  Id: number;
  Style: any;
}

export class Result {
  Id: number;
  Name: string;
  Votes: CandidateVote[];

  constructor() { }

  GetWinner(): string {
    var en = Enumerable.from(this.Votes);
    return en.first(t => t.Position == 1).Name;
  }

}

export class CandidateVote {
  Votes: number;
  Position: number;
  Name: string;
  Party: string;
}

export class Distribution {
  AcNo: number;
  Percent: number;
}
