import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PredictionSettingsComponent } from '../prediction-settings/prediction-settings';

@NgModule({
  declarations: [
    PredictionSettingsComponent
  ],
  imports: [
    IonicPageModule,
  ],
  exports: [
    PredictionSettingsComponent
  ],
  providers: [
  ]
})
export class MapSettingsModule {}

