import { Component} from '@angular/core';
import { ColorProvider } from '../../providers/color';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'legend',
  templateUrl: 'legend.html',
  providers: [DataProvider, ColorProvider]
})
export class LegendComponent {
hidden: boolean = false;
  constructor(public data: DataProvider, public colors: ColorProvider) {
  }

  toggle() { this.hidden = !this.hidden  }

  getParties() { return this.data.getAllParties();}

  getPartyColor(party: string) {
    var col =  this.colors.getPartyColor(party);
    return col;
  }
}
