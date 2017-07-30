import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DataProvider } from '../../providers/data';
import { Survey } from '../../models/survey';
import * as Enumerable from 'linq';
import { MapSettings } from '../../models/map-settings';

@Component({
  selector: 'map-settings',
  templateUrl: 'map-settings.html',
  providers: [DataProvider]
})
export class MapSettingsComponent {
  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() settings: MapSettings;

  acBreakdown: boolean = true;
  acs: number[] = [0, 44, 71, 203, 208];

  showYearRange: boolean = true;
  showTransparency: boolean = true;
  showMapTypes: boolean = true;
  showSelectedConstituenciesOptions: boolean = true;
  redrawDisabled: boolean = false;
  showSelectedWardsOptions: boolean = false;
  wards: string[];
  selectedAC: number;

  reportType: string = "Predictions";
  showReportsOptions: boolean = true;
  reportTypes: string[] = ["Results", "Predictions", "Across Elections"];


  constructor(public data: DataProvider) {
  }

  reportTypeChanged() { 
  }

  marginsOptionChanged() { }

//  electionYearChanged() { this.changeYear() }

  acBreakdownOptionChanged() { }


  acSelectionChanged() {
  //  this.wards = this.getWards(this.selectedAC);
  }

  hidden: boolean = false;
  toggle() {
    this.hidden = !this.hidden;
  }

  wardSelectionChanged() { }

  getAcName(id: number) {
    var sample_constituencies = this.data.getSampleConstituencies();
    var constituenciesEn = Enumerable.from(sample_constituencies);
    if (id == 0 || !constituenciesEn.any(c => c.id == id))
    { return 'All'; }
    return constituenciesEn.first(c => c.id == id).name;
  }

/*
  getWards(id: number): string[] {
    return ["ward1", "ward2"];
  }
*/

  transparency: number = 50;
  selectedWard: string;

  redraw() {
    this.settings.transparency = this.transparency;
    /*
    this.settings.electionYear = this.electionYear;
    this.settings.mapType = this.mapType;
    this.settings.margins = this.margins;
    */
    this.settings.selectedAC = this.selectedAC;
    this.settings.selectedWard = this.selectedWard;
    this.settings.acBreakdown = this.acBreakdown;
    this.settings.reportType = this.reportType;
    this.ionChange.emit();
    this.toggle();
  }

  changePrediction() {
  }

  survey: Survey = {
    men: 10,
    women: 10,

    lingayat: 10,
    vokkaliga: 10,
    kuruba: 10,
    h: 10,
    brahmin: 10,
    dalit: 10,
    uc: 10,
    obc: 10,
    muslim: 10,
    christian: 10,

    _18To24: 10,
    _25To34: 10,
    _35To44: 10,
    _45To60: 10,
    _gt60: 10,

    _lt10k: 10,
    _10kTo20k: 10,
    _20kTo40k: 10,
    _40kTo1Lac: 10,
    _gt1Lac: 10,
  }

}
