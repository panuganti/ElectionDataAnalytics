import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DataProvider } from '../../providers/data';
import { ColorProvider } from '../../providers/color';
import { HttpModule } from '@angular/http';
import { ComponentsModule } from '../../components/components.module';
//import { LoginPage } from '../login/login';
@NgModule({
  declarations: [
    HomePage
    //LoginPage
  ],
  imports: [
    HttpModule,
    ComponentsModule,
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage
  ],
  providers: [
    DataProvider,
    ColorProvider
  ]
})
export class HomePageModule { }
