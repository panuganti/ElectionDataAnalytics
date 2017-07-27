import { Component, EventEmitter, Output } from '@angular/core';
import { DataProvider } from '../../providers/data';
import * as Enumerable from 'linq';

@Component({
  selector: 'map-settings',
  templateUrl: 'map-settings.html',
  providers: [DataProvider]
})
export class MapSettingsComponent {
  @Output() settings: EventEmitter<any> = new EventEmitter<any>();

  electionYear: any = 2014;
  electionRangeValue: any = 2014;
  minYear: number = 1999;
  maxYear: number = 2014;
  mapTypes: string[] = ["pc", "ac", "booth"];
  mapType: string = 'ac';
  margins: boolean = true;
  acBreakdown: boolean = true;
  acs: number[] = [0, 44, 71, 203, 208];

  showYearRange: boolean = true;
  showTransparency: boolean = true;
  showMapTypes: boolean = true;
  showMarginsOption: boolean = true;
  showAcBreakdownOption: boolean = true;
  showSelectedConstituenciesOptions: boolean = true;
  redrawDisabled: boolean = false;
  showSelectedWardsOptions: boolean = false;
  wards: string[];
  selectedAC: number;

  reportType: string;
  showReportsOptions: boolean = true;
  reportTypes: string[] = ["Close Contests", "Safe Seats", "Anti-Incumbency Seats", "Change Seats"];


  constructor(public data: DataProvider) {
  }

  reportTypeChanged() {}

  marginsOptionChanged() { }

  electionYearChanged() { this.changeYear() }

  acBreakdownOptionChanged() { }

  acSelectionChanged() {
    this.wards = this.getWards(this.selectedAC);
  }

  wardSelectionChanged() { }

  getAcName(id: number) {
    var sample_constituencies = this.data.getSampleConstituencies();
    var constituenciesEn = Enumerable.from(sample_constituencies);
    if (id == 0 || !constituenciesEn.any(c => c.id == id))
    { return 'All'; }
    return constituenciesEn.first(c => c.id == id).name;
  }


  getWards(id: number): string[] {
    return ["ward1", "ward2"];
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

  transparency: number = 50;
  selectedWard: string;

  redraw() {
    this.settings.emit({
      "transparency": this.transparency,
      "electionYear": this.electionYear,
      "mapType": this.mapType,
      "margins": this.margins,
      "selectedAC": this.selectedAC,
      "selectedWard": this.selectedWard,
      "acBreakdown": this.acBreakdown,
      "reportType": this.reportType
    });
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