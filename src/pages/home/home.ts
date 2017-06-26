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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: DataProvider, public color: ColorProvider) {
  }

  async ionViewDidLoad() {
    this.geoJson = await this.data.getGeoJson();
    this.setDefaultMap();
  }

  async setDefaultMap() {
    let latLng = new google.maps.LatLng(12.96, 77.59);
    let mapOptions = { center: latLng, zoom: 7 };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.data.addGeoJson(this.geoJson);
    this.map.setMapTypeId('terrain');
    this.map.data.setStyle((feature) => {
      //let id = feature.getProperty('ac');
      //console.log(feature);
      if (this.i == 0) {console.log(feature); this.i++;}
      let id = feature.getProperty('ac');
      console.log(id);
      return {
        strokeWeight: 0.5,
        fillOpacity: 0.7,
        strokeOpacity: 0.5,
        fillColor: this.color.getColor("orange", Math.floor(Math.random() * (100 - 25 + 1)) + 25, 0, 100, 9),
        title: id
      };
    })
  }
i: number = 0;

  load() {


  }

}

export class StyleMaps {
  constructor(public color: ColorProvider) { }

  public GenerateStyleMaps(acResults: Result[]): any[] {
    let en = Enumerable.from(acResults);
    let acStyleMaps: any[] = [];
    en.forEach(element => {
      let votes = Enumerable.from(en.where(t => t.Id == element.Id).first().Votes)
      let party = votes.first(t => t.Position == 1).Party;
      let partyColor = this.colorMap[party];
      let styleMap = this.defaultStyle;
      styleMap.Id = element.Id;
      let totalVotes = votes.select(t => t.Votes).toArray().reduce((a, b) => a + b);
      let margin = votes.first(t => t.Position == 1).Votes - votes.first(t => t.Position == 2).Votes;
      let marginPercent = Math.ceil((margin) * 100 / totalVotes);
      let color = this.color.getColor(partyColor, marginPercent, 0, 25);
      styleMap.Style = {
        strokeWeight: this.defaultStyle.strokeWeight,
        fillOpacity: this.defaultStyle.fillOpacity,
        strokeOpacity: this.defaultStyle.strokeOpacity,
        fillColor: color
      }
      acStyleMaps.push(styleMap);
    });
    return acStyleMaps;
  }

  colorMap: any = { 
    "bjp" : "orange",
    "inc" : "lightblue",
    "jds" : "darkgreen",
    "others": "black"
  }

  defaultStyle: any = {
    strokeWeight: 1,
    fillOpacity: 0.9,
    strokeOpacity: 0.3,
    strokeColor: "white"
  };

}

	export class Result {		
		Id: number;
		Name: string;
		Votes: CandidateVote[];
		
		constructor() { }
		
		GetWinner(): string {
			var en = Enumerable.from(this.Votes);
			return en.first(t=>t.Position == 1).Name;
		}
		
		GetWinningParty(): string {
			var en = Enumerable.from(this.Votes);
			return en.first(t=>t.Position == 1).Party;
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
