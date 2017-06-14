import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { MapComponentModule } from '../../components/map/map.module';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    MapComponentModule,
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}
