import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-constituencies-popover',
  templateUrl: 'constituencies-popover.html',
})
export class ConstituenciesPopoverPage {
  acs: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.acs = this.navParams.get('acs');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
