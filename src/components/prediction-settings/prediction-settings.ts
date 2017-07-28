import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prediction-settings',
  templateUrl: 'prediction-settings.html'
})
export class PredictionSettingsComponent {
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
  }

  emit() {
    this.changed.emit({
      
    });
  }

}
