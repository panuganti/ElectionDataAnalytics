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
    this.map.mapTypes.set('customtype', this.getDefaultMapType());
    this.map.setMapTypeId('terrain');
    this.map.data.setStyle((feature) => {
      let id = feature.getProperty('ac');
      console.log(id);
      return {
        strokeWeight: 0.5,
        fillOpacity: 0.5,
        strokeOpacity: 0.5,
        fillColor: "red"
      };
    })
  }

  getDefaultMapType() {
    var defaultMapType = new google.maps.StyledMapType([
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          { hue: '#0000ff' },
          { saturation: 50 },
          { lightness: -50 }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'all',
        stylers: [
          { visibility: 'off' },
        ]
      }, {
        featureType: 'road.local',
        elementType: 'all',
        stylers: [
          { visibility: 'off' },
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          { hue: '#ff0000' },
          { lightness: 50 },
          { visibility: 'on' },
          { saturation: 98 }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [
          { visibility: 'off' },
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'labels',
        stylers: [
          { visibility: 'on' },
        ]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [
          { hue: '#ff0000' },
          { visibility: 'on' },
          { lightness: -70 }
        ]
      }
    ], { name: 'customtype' });
    return defaultMapType;
  }

}
