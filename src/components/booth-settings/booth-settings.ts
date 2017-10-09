import { Input, Output, Component, EventEmitter } from '@angular/core';
import * as Enumerable from 'linq';
import { DataProvider } from '../../providers/data';

@Component({
  selector: 'booth-settings',
  templateUrl: 'booth-settings.html',
  providers: [DataProvider]
})
export class BoothSettingsComponent {
  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() acIds: any[];
  acId: number;
  constructor(public data: DataProvider) {
  }

  changed() {
    this.ionChange.emit(this.acId);
  }

  getAcs(): any[]{
    return Enumerable.from(this.acIds).orderBy(ac => ac.Name).toArray();
  }
}
