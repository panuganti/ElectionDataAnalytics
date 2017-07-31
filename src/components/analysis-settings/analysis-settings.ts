import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnalysisSettings } from '../../models/analysis-settings';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'analysis-settings',
  templateUrl: 'analysis-settings.html'
})
export class AnalysisSettingsComponent {
  @Input() settings: AnalysisSettings;
  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();
  debouncer: Subject<any> = new Subject<any>();
  analysisType: string;

  constructor() {
  }

  ngOnInit() {
    this.debouncer.debounceTime(100)
      .subscribe(() => this.ionChange.emit());
  }

  analysisTypeChanged() {
    this.settings.analysisType = this.analysisType;
  }
  
  changed() {
    this.debouncer.next();
  }
}
