import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Result } from '../models/result';

@Injectable()
export class DataProvider {
  _url_base = "assets/";
  constructor(public http: Http) {
  }
  //3ff3a0dd66fe6378bcc2dc6ba7a17d8f
  //#geoJsons
  async getGeoJson() {
    var url = 'assets/karnataka.assembly.geo.json';
    var data = await this.http.get(url).map(res => res.json()).toPromise();
    return data;
  }

  async getAllBoothsJson() {
    return await this.http.get(this._url_base + 'karnataka.booth.geojson.json').map(res => res.json()).toPromise();
  }

  async getBoothJson(id: number) {
    return await this.http.get(this._url_base + id + '.booth.geo.json').map(res => res.json()).toPromise();
  }

  async getPreDelimGeoJson() {
    return await this.http.get(this._url_base + 'predelimitation.karnataka.geo.json').map(res => res.json()).toPromise();
  }
  //#geoJsons

  getAcName(id: number): string {
    return "Dharwad";
  }

  getWards(id: number): string[] {
    return ["ward1", "ward2"];
  }

  async getResults(year: string, type: string) {
    switch (year) {
      case '2014':
        return await this.http.get(this._url_base + '2014.pcac.json').map(res => res.json()).toPromise();
      case '2013':
        return await this.http.get(this._url_base + '2013.json').map(res => res.json()).toPromise();
      case '2009':
        return await this.http.get(this._url_base + '2009.pcac.json').map(res => res.json()).toPromise();
      case '2008':
        return await this.http.get(this._url_base + '2008.json').map(res => res.json()).toPromise();
      case '2004':
        return await this.http.get(this._url_base + '2004.json').map(res => res.json()).toPromise();
      case '1999':
        return await this.http.get(this._url_base + '1999.json').map(res => res.json()).toPromise();
      default:
        throw new DOMException();
    }
  }

  getAllParties(): string[] {
    return ["BJP", "INC", "JDS", "OTH", "IND"];
  }

}
