import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DataProvider } from '../../providers/data';
import { Survey } from '../../models/survey';
import * as Enumerable from 'linq';
import { MapSettings } from '../../models/map-settings';
import { ResultsSettings } from '../../models/results-settings';
import { AnalysisSettings } from '../../models/analysis-settings';

@Component({
  selector: 'map-settings',
  templateUrl: 'map-settings.html',
  providers: [DataProvider]
})
export class MapSettingsComponent {
  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() settings: MapSettings;

  acs: number[] = [0, 44, 71, 203, 208];

    reportType: string = "Results";
  showReportsOptions: boolean = true;
  reportTypes: string[] = ["Results", "Predictions", "Across Elections"];
  resultsSettings: ResultsSettings = {
    "transparency": 100,
    "electionYear": 2014,
    "marginLimit": 0,
    "showMargins": true
  };

  analysisSettings: AnalysisSettings = {
    "electionsNo": 1 ,
    "analysisType": 'safeSeats'
  }

  constructor(public data: DataProvider) {
  }

  updateResults() {
    this.settings.transparency = this.resultsSettings.transparency;
    this.settings.electionYear = this.resultsSettings.electionYear;
    this.settings.marginLimit = this.resultsSettings.marginLimit;
    this.settings.showMargins = this.resultsSettings.showMargins;
    this.settings.reportType = this.reportType;
    this.ionChange.emit();
  }

  reloadAnalysis() {
    this.settings.electionsNo = this.analysisSettings.electionsNo;
    this.settings.analysisType = this.analysisSettings.analysisType;
    this.settings.reportType = this.reportType;
    this.ionChange.emit();    
  }
  reportTypeChanged() {   }

  hidden: boolean = false;
  toggle() {
    this.hidden = !this.hidden;
  }

  getAcName(id: number) {
    var sample_constituencies = this.data.getSampleConstituencies();
    var constituenciesEn = Enumerable.from(sample_constituencies);
    if (id == 0 || !constituenciesEn.any(c => c.id == id))
    { return 'All'; }
    return constituenciesEn.first(c => c.id == id).name;
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
