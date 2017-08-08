import { Input, Component } from '@angular/core';
import * as Enumerable from 'linq';

@Component({
  selector: 'summary',
  templateUrl: 'summary.html'
})
export class SummaryComponent {
  @Input() results: any[];
  @Input() acIds: any[];

  groups: any[];
  parties = ["Bharatiya Janta Party", "Indian National Congress", "Janata Dal (Secular)", "Independent"];
  constructor() {
  }

  getSummary() {
    if (!Enumerable.from(this.results).any()) { return; }
//    let acsEn = Enumerable.from(this.acIds);
    let winners = Enumerable.from(this.results)
      .select(r => this.GetWinningParty(r.Votes));
    return Enumerable.from(this.parties).select(p => {
      return { "party": p, "count": winners.count(w => w == p) }
    }).toArray();

  }

  GetWinningParty(votes: any[]): string {
    var en = Enumerable.from(votes);
    return en.first(t => t.Position == 1).Party;
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "grey" : "orange";
  }


}
