import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { MapSettings } from '../../models/map-settings';

@IonicPage()
@Component({
  selector: 'page-settings-modal',
  templateUrl: 'settings-modal.html',
})
export class SettingsModalPage {

  constructor(public view: ViewController) {
  }

  dismiss() {
    console.log('dismiss');
    this.view.dismiss();
  }

  settings: MapSettings = {
    "transparency": 100,
    "electionYear": 2014,
    "marginLimit": 0,
    "showMargins": true,
    "reportType": "Results",
    "electionsNo": 1,
    "analysisType": 'safeSeats'
  }

  redraw() {
    this.view.dismiss(this.settings);
  }

}
