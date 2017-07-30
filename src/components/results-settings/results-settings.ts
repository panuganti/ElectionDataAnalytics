import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ResultsSettings } from '../../models/results-settings';

@Component({
  selector: 'results-settings',
  templateUrl: 'results-settings.html'
})
export class ResultsSettingsComponent {
  @Input() settings: ResultsSettings;
  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();

  mapTypes: string[] = ["pc", "ac", "booth"];
  mapType: string = 'ac';
  electionYear: any = 2014;
  electionRangeValue: any = 2014;
  minYear: number = 1999;
  maxYear: number = 2014;
  margins: boolean = true;



  constructor() {
  }

  emit() {
    this.ionChange.emit();
  }


  mapTypeChanged() {
    if (this.mapType == 'booth') {
      this.minYear = 2008;
      this.maxYear = 2014;
    }
    else if (this.mapType == 'pc' || this.mapType == 'ac') {
      this.minYear = 1999;
      this.maxYear = 2014;
    }
  }

  changeYear() {
    if (this.mapType == 'booth' || this.mapType == 'ac') {
      if (this.electionRangeValue < 2009) {
        this.electionYear = 2008;
      }
      else if (this.electionRangeValue < 2013) {
        this.electionYear = 2009;
      }
      else if (this.electionRangeValue < 2014) {
        this.electionYear = 2013;
      }
      else {
        this.electionYear = 2014;
      }
    }
    if (this.mapType == 'ac') {
      if (this.electionRangeValue < 2003) {
        this.electionYear = 1999;
      }
      else if (this.electionRangeValue < 2004) {
        this.electionYear = 2003;
      }
      else if (this.electionRangeValue < 2009) {
        this.electionYear = 2004;
      }
    }

    if (this.mapType == 'pc') {
      if (this.electionRangeValue < 2003) {
        this.electionYear = this.minYear;
      }
      else if (this.electionRangeValue < 2004) {
        this.electionYear = 2003;
      }
      else if (this.electionRangeValue < 2008) {
        this.electionYear = 2004;
      }
      else if (this.electionRangeValue < 2009) {
        this.electionYear = 2008;
      }
      else if (this.electionRangeValue < 2013) {
        this.electionYear = 2009;
      }
      else if (this.electionRangeValue < 2014) {
        this.electionYear = 2013;
      }
      else {
        this.electionYear = 2014;
      }
    }
  }

}
