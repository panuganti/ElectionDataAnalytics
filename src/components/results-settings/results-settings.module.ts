import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResultsSettingsComponent } from './results-settings';

@NgModule({
  declarations: [
    ResultsSettingsComponent,
  ],
  imports: [
    IonicPageModule.forChild(ResultsSettingsComponent),
  ],
  exports: [
    ResultsSettingsComponent
  ]
})
export class ResultsSettingsComponentModule {}
