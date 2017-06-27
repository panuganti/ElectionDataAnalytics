import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { ColorProvider } from '../../providers/color';
import { Result } from '../../models/result';
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
  boothGeoJson: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: DataProvider, public color: ColorProvider) {
  }

  async ionViewDidLoad() {
    this.boothGeoJson = await this.data.getBoothJson();
    //this.setDefaultMap();
    this.setBoothMap();
  }

  async showBoothResultsOnMap(year: number) {
    var results: Result[] = await this.data.getBoothResults(year);
    var styleMaps = this.color.GenerateBoothStyleMaps(results);

    let styleMapsEn = Enumerable.from(styleMaps);
    this.map.setStyle(function (feature) {
      let id = feature.getProperty('ac');
      return styleMapsEn.first(t => t.Id == id).Style;
    });
  }

  async showResultsOnMap(year: number) {
    var results: Result[] = await this.data.getResults(year);
    var styleMaps = this.color.GenerateStyleMaps(results);

    let styleMapsEn = Enumerable.from(styleMaps);
    this.map.setStyle(function (feature) {
      let id = feature.getProperty('ac');
      return styleMapsEn.first(t => t.Id == id).Style;
    });
  }

  booths: any[];

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
      let id = element.properties.pc;
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(element.geometry.coordinates[1], element.geometry.coordinates[0]),
        icon: lineSymbol
      });
      marker.setMap(this.map);
    });

  }

  async setDefaultMap() {
    let latLng = new google.maps.LatLng(12.96, 77.59);
    let mapOptions = { center: latLng, zoom: 7 };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.data.addGeoJson(this.geoJson);
    this.map.setMapTypeId('terrain');
    this.map.data.setStyle((feature) => {
      let id = feature.getProperty('ac');
      return {
        strokeWeight: 0.5,
        fillOpacity: 0.7,
        strokeOpacity: 0.5,
        fillColor: this.color.getColor("grey", 100, 0, 100, 9),
        title: id
      };
    })
  }

}
