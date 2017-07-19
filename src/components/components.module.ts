import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapSettingsComponent } from './map-settings/map-settings';
import { AcResultComponent } from './ac-result/ac-result';
import { CasteBreakupComponent } from './caste-breakup/caste-breakup';
import { LegendComponent } from './legend/legend';
import { ColorProvider } from '../providers/color';
import { DataProvider } from '../providers/data';

@NgModule({
  declarations: [
    MapSettingsComponent,
    AcResultComponent,
    CasteBreakupComponent,
    LegendComponent
  ],
  imports: [
    IonicPageModule,
  ],
  exports: [
    MapSettingsComponent,
    AcResultComponent,
    CasteBreakupComponent,
    LegendComponent
  ],
  providers: [
    DataProvider,
    ColorProvider
  ]
})
export class ComponentsModule {}

