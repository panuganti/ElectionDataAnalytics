import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, enableProdMode } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { ConstituencyComponent } from '../components/constituency/constituency';

export const firebaseConfig = {
  apiKey: "AIzaSyAWntT5fgd9L0ObvejxnMxiTGy4LDVMBCY",
  authDomain: "electiondataanalytics-2cbbb.firebaseapp.com",
  databaseURL: "https://electiondataanalytics-2cbbb.firebaseio.com",
  projectId: "electiondataanalytics-2cbbb",
  storageBucket: "electiondataanalytics-2cbbb.appspot.com",
  messagingSenderId: "1061878450803"
  };

enableProdMode();

@NgModule({
  declarations: [
    MyApp,
    ConstituencyComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    AngularFireAuth,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
