import { Input, Component } from '@angular/core';

@Component({
  selector: 'ac-result',
  templateUrl: 'ac-result.html'
})
export class AcResultComponent {
  @Input() results: any[];
  result: any;
  constructor() {
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "grey" : "lightblue";
  }
}
