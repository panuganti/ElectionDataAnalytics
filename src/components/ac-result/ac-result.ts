import { Input, Component } from '@angular/core';

@Component({
  selector: 'ac-result',
  templateUrl: 'ac-result.html'
})
export class AcResultComponent {
  @Input() results: any[];
  @Input() name: any;
  result: any;
  constructor() {
  }

  getParty(party: string): string {
    switch(party.trim()) {
      case 'Bharatiya Janta Party':
      return 'BJP';
      case 'Indian National Congress': 
        return 'INC';
      case 'Janata Dal (Secular)':
        return 'JD(S)';
      case 'Independent':
        return 'IND';
      case 'Bahujan Samaj Party':
        return 'BSP';
    }
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "grey" : "lightblue";
  }
}
