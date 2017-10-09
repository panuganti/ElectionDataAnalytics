import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SlidesPage } from './slides';
import { HttpModule } from '@angular/http';
import { ComponentsModule } from '../../components/components.module';
import { DataProvider } from '../../providers/data';
import { ColorProvider } from '../../providers/color';

@NgModule({
  declarations: [
    SlidesPage,
  ],
  imports: [
    HttpModule,
    ComponentsModule,
    IonicPageModule.forChild(SlidesPage),
  ],
  exports: [
    SlidesPage
  ],
  providers: [
    DataProvider,
    ColorProvider
  ]
})
export class SlidesPageModule {}
