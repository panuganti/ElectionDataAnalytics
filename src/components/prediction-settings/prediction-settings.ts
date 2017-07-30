import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Survey } from '../../models/survey';

@Component({
  selector: 'prediction-settings',
  templateUrl: 'prediction-settings.html'
})
export class PredictionSettingsComponent {
  @Input() survey: Survey;
  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
    if (!this.survey) { return; }
    this.men = this.survey.men;
    this.women = this.survey.women;

    this.lingayat = this.survey.lingayat;
    this.vokkaliga = this.survey.vokkaliga;
    this.kuruba = this.survey.kuruba;
    this.h = this.survey.h;
    this.brahmin = this.survey.brahmin;
    this.dalit = this.survey.dalit;
    this.uc = this.survey.uc;
    this.obc = this.survey.obc;
    this.muslim = this.survey.muslim;
    this.christian = this.survey.christian;

    this._18To24 = this.survey._18To24;
    this._25To34 = this.survey._25To34;
    this._35To44 = this.survey._35To44;
    this._45To60 = this.survey._45To60;
    this._gt60 = this.survey._gt60;

    this._lt10k = this.survey._lt10k;
    this._10kTo20k = this.survey._10kTo20k;
    this._20kTo40k = this.survey._20kTo40k;
    this._40kTo1Lac = this.survey._40kTo1Lac;
    this._gt1Lac = this.survey._gt1Lac;
  }

  men: number;
  women: number;
  showGender: boolean = false;
  toggleGender() { this.showGender = !this.showGender; }

  lingayat: number;
  vokkaliga: number;
  kuruba: number;
  h: number;
  brahmin: number;
  dalit: number;
  uc: number;
  obc: number;
  muslim: number;
  christian: number;
  showCaste: boolean = false;
  toggleCaste() { this.showCaste = !this.showCaste; }

  showAge: boolean = false;
  _18To24: number;
  _25To34: number;
  _35To44: number;
  _45To60: number;
  _gt60: number;
  toggleAge() { this.showAge = !this.showAge; }

  showIncome: boolean = false;
  _lt10k: number;
  _10kTo20k: number;
  _20kTo40k: number;
  _40kTo1Lac: number;
  _gt1Lac: number;
  toggleIncome() { this.showIncome = !this.showIncome; }

  genderChange() {
    this.emit();
  }
  communityChange() {
    this.emit();
  }
  ageChange() {
    this.emit();
  }
  incomeChange() {
    this.emit();
  }

  emit() {
    this.ionChange.emit();
  }
}
