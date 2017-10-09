import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConstituencyDashboardPage } from './constituency-dashboard';
import { HttpModule } from '@angular/http';
import { ComponentsModule } from '../../components/components.module';
import { DataProvider } from '../../providers/data';
import { ColorProvider } from '../../providers/color';

@NgModule({
  declarations: [
    ConstituencyDashboardPage,
  ],
  imports: [
    HttpModule,
    ComponentsModule,
    IonicPageModule.forChild(ConstituencyDashboardPage),
  ],
  exports: [
    ConstituencyDashboardPage
  ],
  providers: [
    DataProvider,
    ColorProvider
  ]
})
export class ConstituencyDashboardPageModule {}
