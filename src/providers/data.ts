import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataProvider {
  _url_base = "assets/data/";
  constructor(public http: Http) {
  }
 
  //#geoJsons
  async getGeoJson() {
    var data = await this.http.get(this._url_base + 'karnataka.assembly.geo.json').map(res => res.json()).toPromise();
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

  getWards(id: number): string[] {
    return ["ward1", "ward2"];
  }

  async getSampleConstituencies(): Promise<any[]> {
    return await this.http.get(this._url_base + 'sample_constituencies.json').map(res => res.json()).toPromise();
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
