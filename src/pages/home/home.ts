//region Imports
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { ColorProvider } from '../../providers/color';
import * as Enumerable from 'linq';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { MapSettings } from '../../models/map-settings';
//endregion Imports

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
  marginLimit: number = 10000;
  showMargins: boolean = true;
  reportType: string = "Results";
  electionYear: any = 2014;
  transparency: number = 100;
  settings: MapSettings = {
    "transparency": 100,
    "electionYear": 2014,
    "marginLimit": 0,
    "showMargins": true,
    "reportType": "Results",
    "electionsNo": 1,
    "analysisType": 'safeSeats'
  }

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

  signOut() {
    window.localStorage.removeItem('email');
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

  async ionViewDidLoad() {
    await this.loadMap();
    await this.loadGeoJson();
    await this.loadResults();
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

  async redraw() {
    if (this.settings.reportType == 'Results') {
      this.transparency = this.settings.transparency;
      this.electionYear = this.settings.electionYear;
      this.marginLimit = this.settings.marginLimit;
      this.showMargins = this.settings.showMargins;
      this.reportType = this.settings.reportType;
      this.showLoading();
      this.removeGeoJson();
      await this.loadGeoJson();
      await this.loadResults();
      this.dismissLoading();
    }
    else if (this.settings.reportType == 'Analysis') {
      this.loadMap();
      this.electionYear = '2014';
      this.loadGeoJson();
      await this.showAnalysis();
    }
  }

  async showAnalysis() {
    var results = [];
    this.results.push(await this.data.getResults('2014', 'ac'));
    if (this.settings.electionsNo > 0) {
      results.push(await this.data.getResults('2013', 'ac'));
    }
    if (this.settings.electionsNo > 1) {
      results.push(await this.data.getResults('2009', 'ac'));
    }
    if (this.settings.electionsNo > 2) {
      results.push(await this.data.getResults('2008', 'ac'));
    }
    if (this.settings.analysisType == 'safeSeats') {
      await this.showSafeSeatsAnalysis(results);
    }
    else if (this.settings.analysisType == 'changeSeats') {
      await this.showChangeSeatsAnalysis(results);
    }
  }

  async showSafeSeatsAnalysis(results: any[]) {

  }

  async showChangeSeatsAnalysis(results: any[]) {

  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Loading Map...'
      });
      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  showResults(id: string) {
    if (Enumerable.from(this.results).any(r => r.Id == id)) {
      let acResult = Enumerable.from(this.results).first(r => r.Id == id);
      this.acResults = acResult.Votes;
      this.showAcResults = true;
    }
  }

  removeGeoJson() {
    this.geoJsonFeatures.forEach((val) => { this.map.data.remove(val) });
  }

  geoJsonFeatures: any[];
  async loadGeoJson() {
    if (this.electionYear < 2008) {
      this.geoJson = await this.data.getPreDelimGeoJson();
    }
    else {
      this.geoJson = await this.data.getGeoJson();
    }
    this.geoJsonFeatures = this.map.data.addGeoJson(this.geoJson);
    this.addGeoJsonEventHandlers();
  }

  addGeoJsonEventHandlers() {
    //this.map.data.addListener('click', (event) => { this.zone.run(() => this.acClicked(event)) });
    this.map.data.addListener('mouseover', (event) => { this.zone.run(() => this.acClicked(event)) });
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

  GenerateStyleMaps(acResults: Result[]): any[] {
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
      if (this.settings.showMargins) {
        marginPercent = Math.ceil((margin) * 100 / totalVotes);
      }
      else {
        marginPercent = 10;
      }
      let color = self.color.getColor(partyColor, marginPercent + 5, 0, 25);
      var fillOpacity;
      if (this.settings.marginLimit != 0 && this.settings.marginLimit != 50000 && margin > this.settings.marginLimit) {
        fillOpacity = 0 * this.transparency / 100;
      }
      else {
        fillOpacity = self.defaultStyle.fillOpacity * this.transparency / 100;
      }
      styleMap.Style = {
        strokeWeight: self.defaultStyle.strokeWeight,
        fillOpacity: fillOpacity,
        strokeOpacity: self.defaultStyle.strokeOpacity,
        fillColor: color
      }
      acStyleMaps.push(styleMap);
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


  selectedAC: number;

  acName: string = '';
  acClicked(event: any) {
    this.showAcName = true;
    if (this.electionYear < 2008) {
      this.acName = event.feature.getProperty('AC_NAME');
      this.showResults(event.feature.getProperty('AC_NO'));
    }
    else {
      this.acName = event.feature.getProperty('ac_name');
      this.showResults(event.feature.getProperty('ac'));
    }
  }


  visibility: boolean = true;


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

/*
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
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(element.geometry.coordinates[1], element.geometry.coordinates[0]),
        icon: lineSymbol
      });
      marker.setMap(this.map);
    });
  }
  */
