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

  async  getSurvey(id: number, party: string) : Promise<any> {
    switch(party) {
      case 'bjp': return await this.http.get('assets/data/surveys/' + id  + '_bjp.json').map(res => res.json()).toPromise();
      case 'cong': return await this.http.get('assets/data/surveys/' + id  + '_cong.json').map(res => res.json()).toPromise();
      case 'jds': return await this.http.get('assets/data/surveys/' + id  + '_jds.json').map(res => res.json()).toPromise();
    }
  }

  async getDemographics(id: number): Promise<any> {
      return await this.http.get('assets/data/surveys/' + id  + '_demographics.json').map(res => res.json()).toPromise();
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

  async getBoothGeoJson(id: number) {
    return await this.http.get('assets/data/boothGeoJsons/' + id + '.geojson.txt').map(res => res.json()).toPromise();
  }

  async getIdNames() {
    return await this.http.get('assets/data/acnames.txt').map(res => res.json()).toPromise();
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
