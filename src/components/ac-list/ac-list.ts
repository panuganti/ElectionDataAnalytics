import { Input, Component } from '@angular/core';
import { AC } from '../../models/ac';

@Component({
  selector: 'ac-list',
  templateUrl: 'ac-list.html'
})
export class AcListComponent {
  @Input() results: any[];
  acs: AC[];

  constructor() {
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "white" : "orange";
  }


}
