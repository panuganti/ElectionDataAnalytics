import { Component } from '@angular/core';

@Component({
  selector: 'ac-list',
  templateUrl: 'ac-list.html'
})
export class AcListComponent {

  constructor() {
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "white" : "orange";
  }

}