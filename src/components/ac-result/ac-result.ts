import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'ac-result',
  templateUrl: 'ac-result.html',
  providers: [DataProvider]
})
export class AcResultComponent {

  constructor(public data: DataProvider) {
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "white" : "orange";
  }

  getParties() {
    return this.data.getAllParties();
  }

  getVotePercent(party: string) { 
    return 10;
  }

  getVotes(party: string) {  return 10000; }

}
