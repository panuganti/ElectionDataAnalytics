//region Imports
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { ColorProvider } from '../../providers/color';
import * as Enumerable from 'linq';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { MapSettings } from '../../models/map-settings';
import { Utils } from '../../models/utils';
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
    "reportType": "Booth",
    "electionsNo": 1,
    "analysisType": 'safeSeats'
  }

  boothGeoJson: any;
  styleMaps: any;
  results: any[];
  prev1results: any[];
  prev2results: any[];
  years: string[];
  loading: Loading;
  acResults: CandidateVote[];
  acPrev1Results: CandidateVote[];
  acPrev2Results: CandidateVote[];

  showLegend: boolean = true;
  showAcResults: boolean = false;
  showCasteBreakup: boolean = false;
  showAcName: boolean = false;
  showMapSettings: boolean = true;
  showSummary: boolean = false;

  acs: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: DataProvider, public color: ColorProvider, public loadingCtrl: LoadingController,
    public zone: NgZone, public afAuth: AngularFireAuth) {
    let email = window.localStorage.getItem('email');
    if (!email) {
      this.navCtrl.setRoot('LoginPage');
    }
  }

  async boothAcChanged(ev) {
    this.removeGeoJson();
    await this.setBoothMap(ev);
  }

  async setBoothMap(id: number) {
    var lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
      strokeColor: '#393'
    };

    this.boothGeoJson = await this.data.getBoothGeoJson(id);

    let latLng = new google.maps.LatLng(this.boothGeoJson.features[0].geometry.coordinates[1], this.boothGeoJson.features[0].geometry.coordinates[0]);
    let mapOptions = { center: latLng, zoom: 10 };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.setMapTypeId('terrain');

    this.boothGeoJson.features.forEach(element => {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(element.geometry.coordinates[1], element.geometry.coordinates[0]),
        icon: lineSymbol
      });
      marker.addListener('click', (event) => { this.zone.run( () => this.boothClicked(element)  )});
      marker.setMap(this.map);
    });
  }

  showBoothInfo: boolean = false;
  booth: any;
  boothClicked(element) {
    this.booth = element;
    this.showBoothInfo = true;
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
    this.showSummary = false;
    var results = [];
    var acResult = await this.data.getResults('2014', 'ac');
    results.push(Enumerable.from(acResult));
    if (this.settings.electionsNo > 0) {
      var acResult = await this.data.getResults('2013', 'ac');
      results.push(Enumerable.from(acResult));
    }
    if (this.settings.electionsNo > 1) {
      var acResult = await this.data.getResults('2009', 'ac');
      results.push(Enumerable.from(acResult));
    }
    if (this.settings.electionsNo > 2) {
      var acResult = await this.data.getResults('2008', 'ac');
      results.push(Enumerable.from(acResult));
    }
    if (this.settings.analysisType == 'safeSeats') {
      await this.showSafeSeatsAnalysis(results);
    }
    else if (this.settings.analysisType == 'changeSeats') {
      await this.showChangeSeatsAnalysis(results);
    }
  }

  async showSafeSeatsAnalysis(results: any[]) {
    let styleMaps = this.GenerateSafeSeatsStyleMaps(results);
    this.showLoading();
    this.removeGeoJson();
    await this.loadGeoJson();
    this.dismissLoading();
    this.displayStyleMaps(styleMaps);
  }

  async showChangeSeatsAnalysis(results: any[]) {
    let styleMaps = this.GenerateChangeSeatsStyleMaps(results);
    this.showLoading();
    this.removeGeoJson();
    await this.loadGeoJson();
    this.dismissLoading();
    this.displayStyleMaps(styleMaps);
  }

  GenerateChangeSeatsStyleMaps(acResults: Result[][]): any[] {
    let acStyleMaps: any[] = [];
    let self = this;
    let en2014 = Enumerable.from(acResults[0]);
    en2014.forEach(element => {
      let styleMap: AcStyleMap = { Id: -1, Style: {} };
      styleMap.Style = self.defaultStyle;
      if (element.Id < 0) {
        acStyleMaps.push(styleMap); return;
      }
      let votes = Enumerable.from(en2014.where(t => t.Id == element.Id).first().Votes);
      let winner2014 = votes.first(t => t.Position == 1).Party;
      let isChangeSeat: boolean = false;
      if (self.settings.electionsNo > 0) {
        let results1En = Enumerable.from(acResults[1]).where(t => t.Id == element.Id);
        if (!results1En.any()) {
          acStyleMaps.push(styleMap); return;
        }
        let v1 = Enumerable.from(results1En.first().Votes)
        if (winner2014 != v1.first(t => t.Position == 1).Party) {
          isChangeSeat = true;
        }
      }
      if (self.settings.electionsNo > 1) {
        let results2En = Enumerable.from(acResults[2]).where(t => t.Id == element.Id);
        if (!results2En.any()) {
          acStyleMaps.push(styleMap); return;
        }
        let v2 = Enumerable.from(results2En.first().Votes)
        if (winner2014 != v2.first(t => t.Position == 1).Party) {
          isChangeSeat = true;
        }
      }
      if (self.settings.electionsNo > 2) {
        let results3En = Enumerable.from(acResults[3]).where(t => t.Id == element.Id);
        if (!results3En.any()) {
          acStyleMaps.push(styleMap); return;
        }
        let v3 = Enumerable.from(results3En.first().Votes)
        if (winner2014 != v3.first(t => t.Position == 1).Party) {
          isChangeSeat = true;
        }
      }
      styleMap.Id = element.Id;
      if (isChangeSeat) {
        let partyColor = self.getColor(winner2014);
        let color = self.color.getColor(partyColor, 15, 0, 25);
        styleMap.Style = {
          strokeWeight: self.defaultStyle.strokeWeight,
          fillOpacity: self.defaultStyle.fillOpacity,
          strokeOpacity: self.defaultStyle.strokeOpacity,
          fillColor: color
        }
      }
      acStyleMaps.push(styleMap);
    });
    return acStyleMaps;
  }


  GenerateSafeSeatsStyleMaps(acResults: Result[][]): any[] {
    let acStyleMaps: any[] = [];
    let self = this;
    let en2014 = Enumerable.from(acResults[0]);
    en2014.forEach(element => {
      let styleMap: AcStyleMap = { Id: -1, Style: {} };
      styleMap.Style = self.defaultStyle;
      if (element.Id < 0) {
        acStyleMaps.push(styleMap); return;
      }
      let votes = Enumerable.from(en2014.where(t => t.Id == element.Id).first().Votes);
      let winner2014 = votes.first(t => t.Position == 1).Party;
      let isSafeSeat: boolean = true;
      if (self.settings.electionsNo > 0) {
        let results1En = Enumerable.from(acResults[1]).where(t => t.Id == element.Id);
        if (!results1En.any()) {
          acStyleMaps.push(styleMap); return;
        }
        let v1 = Enumerable.from(results1En.first().Votes)
        if (winner2014 != v1.first(t => t.Position == 1).Party) {
          isSafeSeat = false;
        }
      }
      if (self.settings.electionsNo > 1) {
        let results2En = Enumerable.from(acResults[2]).where(t => t.Id == element.Id);
        if (!results2En.any()) {
          acStyleMaps.push(styleMap); return;
        }
        let v2 = Enumerable.from(results2En.first().Votes)
        if (winner2014 != v2.first(t => t.Position == 1).Party) {
          isSafeSeat = false;
        }
      }
      if (self.settings.electionsNo > 2) {
        let results3En = Enumerable.from(acResults[3]).where(t => t.Id == element.Id);
        if (!results3En.any()) {
          acStyleMaps.push(styleMap); return;
        }
        let v3 = Enumerable.from(results3En.first().Votes)
        if (winner2014 != v3.first(t => t.Position == 1).Party) {
          isSafeSeat = false;
        }
      }
      styleMap.Id = element.Id;
      if (isSafeSeat) {
        let partyColor = self.getColor(winner2014);
        let color = self.color.getColor(partyColor, 15, 0, 25);
        styleMap.Style = {
          strokeWeight: self.defaultStyle.strokeWeight,
          fillOpacity: self.defaultStyle.fillOpacity,
          strokeOpacity: self.defaultStyle.strokeOpacity,
          fillColor: color
        }
      }
      acStyleMaps.push(styleMap);
    });
    return acStyleMaps;
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
      if (this.prev1Year != 0) {
        let ac1Result = Enumerable.from(this.prev1results).first(r => r.Id == id);
        this.acPrev1Results = ac1Result.Votes;
      }
      if (this.prev2Year != 0) {
        let ac2Result = Enumerable.from(this.prev2results).first(r => r.Id == id);
        this.acPrev2Results = ac2Result.Votes;
      }
      this.showAcResults = true;
    }
  }

  removeGeoJson() {
    this.geoJsonFeatures.forEach((val) => { this.map.data.remove(val) });
  }

  nameIdMap: any[];
  geoJsonFeatures: any[];
  async loadGeoJson() {
    let geojsonfornames: any[];
    if (this.electionYear < 2008) {
      this.geoJson = await this.data.getPreDelimGeoJson();
      geojsonfornames = this.geoJson.features;
      this.nameIdMap = Enumerable.from(geojsonfornames).select(c => { return { "acId": c.properties.AC_NO, "name": c.properties.AC_NAME } }).toArray();
    }
    else {
      this.geoJson = await this.data.getGeoJson();
      geojsonfornames = this.geoJson.features;
      this.nameIdMap = Enumerable.from(geojsonfornames).select(c => { return { "acId": c.properties.ac, "name": c.properties.ac_name } }).toArray();
    }
    this.geoJsonFeatures = this.map.data.addGeoJson(this.geoJson);
    this.addGeoJsonEventHandlers();
  }

  addGeoJsonEventHandlers() {
    this.map.data.addListener('click', (event) => { this.zone.run(() => this.acClicked(event)) });
  }


  prev1Year: number;
  prev2Year: number;
  async loadResults() {
    this.showSummary = true;
    this.results = await this.data.getResults(this.electionYear.toString(), 'ac');
    this.prev1Year = Utils.getPreviousElectionYear(this.electionYear);
    if (this.prev1Year != 0) {
      this.prev1results = await this.data.getResults(this.prev1Year.toString(), 'ac');
    }
    this.prev2Year = Utils.getPreviousElectionYear(this.prev1Year);
    if (this.prev2Year != 0) {
      this.prev2results = await this.data.getResults(this.prev2Year.toString(), 'ac');
    }
    this.styleMaps = this.GenerateStyleMaps(this.results);
    this.displayStyleMaps(this.styleMaps);
  }

  acIds: any[];
  displayStyleMaps(styleMaps: any[]) {
    let styleMapsEn: any = Enumerable.from(styleMaps);
    this.acs = [];
    this.acIds = [];
    this.map.data.setStyle((feature) => {
      var id;
      var name;
      if (this.electionYear > 2007) {
        id = feature.getProperty('ac');
        name = feature.getProperty('ac_name');
      }
      else {
        id = feature.getProperty('AC_NO');
        name = feature.getProperty('AC_NAME');
      }
      if (styleMapsEn.any(t => t.Id == id)) {
        var style = styleMapsEn.first(t => t.Id == id).Style;
        if (style.fillOpacity != 0) {
          this.acs.push(name);
          this.acIds.push(id);
        }
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
    strokeWeight: 0.5,
    fillOpacity: 0.7,
    strokeOpacity: 0.3,
    fillColor: "white"
  };

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

