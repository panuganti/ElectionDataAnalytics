import { Component } from '@angular/core';
import * as Enumerable from 'linq';
import { Utils } from '../../models/utils';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'constituency',
  templateUrl: 'constituency.html',
  providers: [DataProvider]
})
export class ConstituencyComponent {
  acIds: any[];
  showAcResult: boolean = false;  
  showCasteBreakup: boolean = true;
  showBoothInfo: boolean = true;
  results: any[];
  electionYear: number = 2014;
  prev1results: any[];
  prev2results: any[];
  acResults: any[];
  prev1Year: number = 2013;
  acPrev1Results: any[];
  prev2Year: number = 2009;
  acPrev2Results: any[];

  constructor(public data: DataProvider) {
  }

  async getAcNames() {
    this.acIds = await this.data.getIdNames();
  }

  acChanged(ev) {    
    this.showAcResult = true;
    this.acClicked(ev);
  }

  acName: string = '';
  acClicked(event: any) {
      var ac: any = Enumerable.from(this.acIds).where(ac => ac.Id == event).first();
      this.acName = ac.Name;
      this.showResults(event);
  }

  async loadResults() {
    this.results = await this.data.getResults(this.electionYear.toString(), 'ac');
    this.prev1Year = Utils.getPreviousElectionYear(this.electionYear);
    if (this.prev1Year != 0) {
      this.prev1results = await this.data.getResults(this.prev1Year.toString(), 'ac');
    }
    this.prev2Year = Utils.getPreviousElectionYear(this.prev1Year);
    if (this.prev2Year != 0) {
      this.prev2results = await this.data.getResults(this.prev2Year.toString(), 'ac');
    }
  }

  showResults(id: string) {
    if (Enumerable.from(this.results).any(r => r.Id == id)) {
      let acResult = Enumerable.from(this.results).first(r => r.Id == id);
      this.acResults = acResult.Votes;
      if (this.prev1Year != 0) {
        let ac1Result = Enumerable.from(this.prev1results).first(r => r.Id == id);
        this.acPrev1Results = ac1Result.Votes;
      }
      if (this.prev2Year != 0) {
        let ac2Result = Enumerable.from(this.prev2results).first(r => r.Id == id);
        this.acPrev2Results = ac2Result.Votes;
      }
    }
  }  

}
