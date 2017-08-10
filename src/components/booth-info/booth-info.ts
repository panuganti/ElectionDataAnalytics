import { Input, Component } from '@angular/core';

@Component({
  selector: 'booth-info',
  templateUrl: 'booth-info.html'
})
export class BoothInfoComponent {

  @Input() booth: any;

  constructor() {
  }

}
