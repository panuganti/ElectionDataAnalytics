import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { ColorProvider } from '../../providers/color';
import * as Enumerable from 'linq';

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
  results: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: DataProvider, public color: ColorProvider) {
  }

  async ionViewDidLoad() {
    this.geoJson = await this.data.getGeoJson();
    var results = await this.data.getResults('2008', 'ac');
    this.results = this.GenerateStyleMaps(results);
    this.setDefaultMap();
  }

  async setDefaultMap() {
    let latLng = new google.maps.LatLng(12.96, 77.59);
    let mapOptions = { center: latLng, zoom: 7 };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.data.addGeoJson(this.geoJson);
    let styleMaps: any = Enumerable.from(this.results);
    this.map.setMapTypeId('terrain');
    this.map.data.setStyle((feature) => {
      let id = feature.getProperty('ac');
      if (styleMaps.any(t => t.Id == id)) {
        return styleMaps.first(t => t.Id == id).Style;
      }
      return {
        strokeWeight: 0.5,
        fillOpacity: 0.7,
        strokeOpacity: 0.5,
        fillColor: this.color.getColor("black", Math.floor(Math.random() * (100 - 25 + 1)) + 25, 0, 100, 9),
        title: id
      };
    })
  }

  public GenerateStyleMaps(acResults: Result[]): any[] {
    let en = Enumerable.from(acResults);
    let acStyleMaps: any[] = [];
    let self = this;
    en.forEach(element => {
      console.log(element.Id);
      let votes = Enumerable.from(en.where(t => t.Id == element.Id).first().Votes)
      let party = votes.first(t => t.Position == 1).Party;
      let partyColor = self.getColor(party);
      let styleMap: AcStyleMap = { Id: -1, Style: {}};
      styleMap.Style = self.defaultStyle;
      styleMap.Id = element.Id;
      let totalVotes = votes.select(t => t.Votes).toArray().reduce((a, b) => a + b);
      let margin = votes.first(t => t.Position == 1).Votes - votes.first(t => t.Position == 2).Votes;
      let marginPercent = Math.ceil((margin) * 100 / totalVotes);
      let color = self.color.getColor(partyColor, marginPercent, 0, 25);
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
    console.log(party);
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

  GetWinningParty(): string {
    var en = Enumerable.from(this.Votes);
    return en.first(t => t.Position == 1).Party;
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
