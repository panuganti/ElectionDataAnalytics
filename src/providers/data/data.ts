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
    return await this.http.get('assets/data/geojsons/karnataka.assembly.geo.json').map(res => res.json()).toPromise();
  }

  async getBoothJson() {
    return await this.http.get('assets/data/karnataka.booth.geojson.json').map(res => res.json()).toPromise();
  }

  async getPreDelimGeoJson() {
    return await this.http.get('assets/data/geojsons/predelimitation.karnataka.geo.json').map(res => res.json()).toPromise();
  }

  async getResults(year: string, type: string) {
    switch(year) {
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
        throw new DOMException();
    }
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

}
