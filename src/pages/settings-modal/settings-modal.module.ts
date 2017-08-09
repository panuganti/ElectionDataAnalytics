import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsModalPage } from './settings-modal';
import { HttpModule } from '@angular/http';
import { ComponentsModule } from '../../components/components.module';
import { DataProvider } from '../../providers/data';
import { ColorProvider } from '../../providers/color';

@NgModule({
  declarations: [
    SettingsModalPage
  ],
  imports: [
    HttpModule,
    ComponentsModule,
    IonicPageModule.forChild(SettingsModalPage),
  ],
  exports: [
    SettingsModalPage
  ],
  providers: [
    DataProvider,
    ColorProvider
  ]
})
export class SettingsModalPageModule {}
