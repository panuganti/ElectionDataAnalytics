import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapSettingsComponent } from './map-settings/map-settings';
import { AcResultComponent } from './ac-result/ac-result';
import { CasteBreakupComponent } from './caste-breakup/caste-breakup';
import { LegendComponent } from './legend/legend';
import { ColorProvider } from '../providers/color';
import { DataProvider } from '../providers/data';
import { AcListComponent } from './ac-list/ac-list';
import { SummaryComponent } from './summary/summary';
import { PredictionSettingsComponent } from './prediction-settings/prediction-settings';

@NgModule({
  declarations: [
    MapSettingsComponent,
    AcResultComponent,
    CasteBreakupComponent,
    LegendComponent,
    AcListComponent,
    SummaryComponent,
    PredictionSettingsComponent
  ],
  imports: [
    IonicPageModule,
  ],
  exports: [
    MapSettingsComponent,
    AcResultComponent,
    CasteBreakupComponent,
    LegendComponent,
    AcListComponent,
    SummaryComponent,
    PredictionSettingsComponent
  ],
  providers: [
    DataProvider,
    ColorProvider
  ]
})
export class ComponentsModule {}

