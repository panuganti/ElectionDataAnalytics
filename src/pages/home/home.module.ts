import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DataProvider } from '../../providers/data/data';
import { ColorProvider } from '../../providers/color';
//import { Result, CandidateVote } from '../../models/result';
import { HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    HttpModule,
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
export class HomePageModule {}
