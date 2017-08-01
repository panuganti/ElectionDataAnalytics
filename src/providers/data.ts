import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataProvider {
 sample_constituencies = [
      {
        "id": 44,
        "name": "Gulbarga South"
      },
      {
        "id": 71,
        "name": "Dharwad"
      },
      {
        "id": 203,
        "name": "Mangalore City South"
      },
      {
        "id": 208,
        "name": "Madikeri"
      }
    ];
  constructor(public http: Http) {
  }
 
  //#geoJsons
  async getGeoJson() {
    return await this.http.get('assets/data/geojsons/karnataka.assembly.small.geo.json').map(res => res.json()).toPromise();
  }

  async getBoothJson() {
    return await this.http.get('assets/data/geojsons/karnataka.booth.geojson.json').map(res => res.json()).toPromise();
  }

  async getPreDelimGeoJson() {
    return await this.http.get('assets/data/geojsons/predelimitation.karnataka.small.geo.json').map(res => res.json()).toPromise();
  }

  getSampleConstituencies() {
    return this.sample_constituencies;
  }

  async getResults(year: string, type: string) {
    switch (year) {
      case '2014':
        return await this.http.get('assets/data/results/2014.pcac.json').map(res => res.json()).toPromise();
      case '2013':
        return await this.http.get('assets/data/results/2013.json').map(res => res.json()).toPromise();
      case '2009':
        return await this.http.get('assets/data/results/2009.pcac.json').map(res => res.json()).toPromise();
      case '2008':
        return await this.http.get('assets/data/results/2008.json').map(res => res.json()).toPromise();
      case '2004':
        return await this.http.get('assets/data/results/2004.json').map(res => res.json()).toPromise();
      case '1999':
        return await this.http.get('assets/data/results/1999.json').map(res => res.json()).toPromise();
      default:
        return;
    }
  }

  async getBoothResults(year: number) {
    let filename: string = '';
    switch (year) {
      case 2014: filename = 'assets/data/2014.booth.results.json';
        break;
      case 2013: filename = 'assets/data/2013.booth.results.json';
        break;
      case 2009: filename = 'assets/data/2009.booth.results.json';
        break;
      case 2008: filename = 'assets/data/2008.booth.results.json';
        break;
      default:
        throw new DOMException();
    }
  }

  getAllParties(): string[] {
    return ["BJP", "INC", "JDS", "OTH"];
  }

}
