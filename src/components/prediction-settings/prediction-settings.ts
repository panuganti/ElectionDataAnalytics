import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Survey } from '../../models/survey';
import { DataProvider } from '../../providers/data';
import * as Enumerable from 'linq';

@Component({
  selector: 'prediction-settings',
  templateUrl: 'prediction-settings.html',
  providers: [DataProvider]
})
export class PredictionSettingsComponent {
  bjpSurvey: Survey;
  congSurvey: Survey;
  jdsSurvey: Survey;
  demographics: Survey;
  selectedAC: number;
  survey: Survey;
  @Output() ionChange: EventEmitter<any> = new EventEmitter<any>();

  selectedSurvey: Survey;

  acs: number[] = [44, 71, 203, 208];

  constructor(public data: DataProvider) {
  }

  async acSelectionChanged() {
    this.bjpSurvey = await this.data.getSurvey(this.selectedAC, 'bjp');
    this.congSurvey = await this.data.getSurvey(this.selectedAC, 'cong');
    this.jdsSurvey = await this.data.getSurvey(this.selectedAC, 'jds');
    this.demographics = await this.data.getDemographics(this.selectedAC);
    this.survey = this.bjpSurvey;
    this.showControls = true;
  }

  votes: number[] = [0,0,0,0]; 
  guessWinner() {
    this.votes[0] = (this.bjpSurvey.men * this.demographics.men + this.bjpSurvey.women * this.demographics.women) / 100;
    this.votes[1] = (this.congSurvey.men * this.demographics.men + this.congSurvey.women * this.demographics.women) / 100;
    this.votes[2] = (this.jdsSurvey.men * this.demographics.men + this.jdsSurvey.women * this.demographics.women) / 100;
    this.votes[3] = 100 - (this.votes[0] + this.votes[1] + this.votes[2]);
  }


  getAcName(id: number) {
    var sample_constituencies = this.data.getSampleConstituencies();
    var constituenciesEn = Enumerable.from(sample_constituencies);
    if (id == 0 || !constituenciesEn.any(c => c.id == id))
    { return 'All'; }
    return constituenciesEn.first(c => c.id == id).name;
  }

  showControls: boolean = false;
  showGender: boolean = false;
  toggleGender() { this.showGender = !this.showGender; }

  showCaste: boolean = false;
  toggleCaste() { this.showCaste = !this.showCaste; }

  showAge: boolean = false;
  toggleAge() { this.showAge = !this.showAge; }

  showIncome: boolean = false;
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
