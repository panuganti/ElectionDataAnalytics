import { Component } from '@angular/core';

@Component({
  selector: 'caste-breakup',
  templateUrl: 'caste-breakup.html'
})
export class CasteBreakupComponent {

  castes: string[] = ["lingayat", "gowda", "brahmin", "muslim", "others"];

  constructor() {
  }

  getCastePercent(caste): number {
    return 10;
  }

  getBkgndColor(i: number) {
    return (i & 1)? "white": "lightblue";
  }
}

export interface map {
    [caste: string]: number;
}
