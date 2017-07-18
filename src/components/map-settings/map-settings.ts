import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'map-settings',
  templateUrl: 'map-settings.html'
})
export class MapSettingsComponent {
@Output() settings: EventEmitter<any> = new EventEmitter<any>();


  electionYear: any = 2014;
  electionRangeValue: any = 2014;
  minYear: number = 1999;
  maxYear: number = 2014;
  showYearRange: boolean = false;
  mapTypes: string[] = ["pc", "ac", "booth"];
  mapType: string;

  constructor() {
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
    this.showYearRange = true;
  }

  changeYear() {
    if (this.mapType == 'booth') {
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

  /*
    mapTypeChangead() {
    switch (this.mapType) {
      case 'pc':
        this.years = ["2014", "2009", "2004", "1999"];
      case 'ac':
        this.years = ["2014", "2013", "2009", "2008", "2004", "2003", "1999"];
      case 'booth':
        this.years = ["2014", "2013", "2009", "2008", "2004", "2003", "1999"];
      default:
        this.years = ["2014", "2013", "2009", "2008", "2004", "2003", "1999"];
    }
  }
*/


  }
