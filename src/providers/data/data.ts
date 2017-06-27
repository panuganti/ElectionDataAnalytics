import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Result } from '../../models/result';

@Injectable()
export class DataProvider {

  constructor(public http: Http) {
  }

  async getGeoJson() {
    return await this.http.get('assets/data/karnataka.assembly.geo.json').map(res => res.json()).toPromise();
  }

  async getBoothJson() {
    return await this.http.get('assets/data/karnataka.booth.geojson').map(res => res.json()).toPromise();
  }

  async getPreDelimGeoJson() {
    return await this.http.get('assets/data/predelimitation.karnataka.geo.json').map(res => res.json()).toPromise();
  }

  async getBoothResults(year: number): Promise<Result[]> {
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
        filename = '';
    }
    return await this.http.get(filename).map(res => res.json()).toPromise();
  }

  async getResults(year: number): Promise<Result[]> {
    let filename: string = '';
    switch (year) {
      case 2014: filename = 'assets/data/2014.results.json';
        break;
      case 2013: filename = 'assets/data/2013.results.json';
        break;
      case 2009: filename = 'assets/data/2009.results.json';
        break;
      case 2008: filename = 'assets/data/2008.results.json';
        break;
      default:
        filename = '';
    }
    return await this.http.get(filename).map(res => res.json()).toPromise();
  }

}
