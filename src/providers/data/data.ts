import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataProvider {

  constructor(public http: Http) {
  }

  async getGeoJson() {
    return await this.http.get('assets/data/geojsons/karnataka.assembly.geo.json').map(res => res.json()).toPromise();
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

}
