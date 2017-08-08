import { Input, Component } from '@angular/core';

@Component({
  selector: 'ac-list',
  templateUrl: 'ac-list.html'
})
export class AcListComponent {
  @Input() acs: string[];
  show: boolean = true;
  constructor() {
  }

  toggle() {
    this.show = !this.show;
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "white" : "lightgreen";
  }


}
