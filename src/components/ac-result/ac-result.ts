import { Input, Component } from '@angular/core';

@Component({
  selector: 'ac-result',
  templateUrl: 'ac-result.html'
})
export class AcResultComponent {
  @Input() results: any[];
  @Input() name: any;
  @Input() electionYear: number;
  @Input() acPrev1Results: any[];
  @Input() prev1Year: number;
  @Input() acPrev2Results: any[];
  @Input() prev2Year: number;

  result: any;
  constructor() {
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "grey" : "lightblue";
  }
}
