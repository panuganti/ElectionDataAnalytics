import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataProvider {

  constructor(public http: Http) {
  }

  async getGeoJson() {
    //return await this.http.get('assets/data/karnataka.booth.geojson').map(res => res.json()).toPromise();
    return await this.http.get('assets/data/karnataka.assembly.geo.json').map(res => res.json()).toPromise();
  }

  async getPreDelimGeoJson() {
    return await this.http.get('assets/data/predelimitation.karnataka.geo.json').map(res => res.json()).toPromise();
  }

}
