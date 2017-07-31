import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ResultsSettings } from '../../models/results-settings';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'results-settings',
  templateUrl: 'results-settings.html'
})
export class ResultsSettingsComponent {
  @Input() settings: ResultsSettings;
  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();
  debouncer: Subject<any> = new Subject<any>();

  electionRangeValue: any = 2014;
  minYear: number = 1999;
  maxYear: number = 2014;
  currentElectionYear: number;

  constructor() {
  }

  ngOnInit() {
    this.currentElectionYear = this.settings.electionYear;
    this.debouncer.debounceTime(100)
           .subscribe(() => this.ionChange.emit());
  }

  changed() {
    this.debouncer.next();    
  }

  setElectionYear() {
    if (this.electionRangeValue < 2004) {
      this.settings.electionYear = 1999;
    }
    else if (this.electionRangeValue < 2008) {
      this.settings.electionYear = 2004;
    }
    else if (this.electionRangeValue < 2009) {
      this.settings.electionYear = 2008;
    }
    else if (this.electionRangeValue < 2013) {
      this.settings.electionYear = 2009;
    }
    else if (this.electionRangeValue < 2014) {
      this.settings.electionYear = 2013;
    }
    else {
      this.settings.electionYear = 2014;
    }
    if (this.settings.electionYear != this.currentElectionYear) {
      this.currentElectionYear = this.settings.electionYear;
      this.changed();
    }
  }
}
