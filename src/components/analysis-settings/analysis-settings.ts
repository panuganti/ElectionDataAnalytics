import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnalysisSettings } from '../../models/analysis-settings';

@Component({
  selector: 'analysis-settings',
  templateUrl: 'analysis-settings.html'
})
export class AnalysisSettingsComponent {
@Input() settings: AnalysisSettings;
@Output() ionChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

}
