import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DataProvider]
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  geoJson: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public data: DataProvider) {
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
      return {
        strokeWeight: 0.5,
        fillOpacity: 0.5,
        strokeOpacity: 0.5,
        fillColor: "red"
      };
    })
  }
i: number = 0;

  load() {


  }
}
