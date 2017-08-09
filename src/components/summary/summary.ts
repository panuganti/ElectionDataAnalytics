import { Input, Component, Output, EventEmitter } from '@angular/core';
import * as Enumerable from 'linq';

@Component({
  selector: 'summary',
  templateUrl: 'summary.html'
})
export class SummaryComponent {
  @Input() results: any[];
  @Input() acIds: any[];
  @Input() nameIdMap: any[];
  @Output() popover: EventEmitter<string[]> = new EventEmitter<string[]>();

  acs: any[];
  summaryACs: any[];
  groups: any[];
  parties = ["Bharatiya Janta Party", "Indian National Congress", "Janata Dal (Secular)", "Independent"];
  constructor() {
  }

  getSummary() {
    if (!Enumerable.from(this.results).any()) { return; }
    let winners = Enumerable.from(this.results)
      .select(r => this.GetWinningParty(r.Votes));
    this.summaryACs = Enumerable.from(this.parties).select(p => {
      return { "party": p, "count": winners.count(w => w == p) }
    }).toArray();
    return this.summaryACs;
  }

  showACs(party: string) {
    let nameIdMapEn = Enumerable.from(this.nameIdMap);
    let winners = Enumerable.from(this.results)
      .select(r => { return { "id": r.Id, "winner":  this.GetWinningParty(r.Votes) };} );
    let acs = winners.where(w => w.winner == party);
    this.acs = nameIdMapEn.where(ni => acs.any(ac => ac.id == ni.acId)).select(ni => ni.name).toArray();
    this.popover.emit(this.acs);
  }

  GetWinningParty(votes: any[]): string {
    var en = Enumerable.from(votes);
    return en.first(t => t.Position == 1).Party;
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "grey" : "orange";
  }


}
