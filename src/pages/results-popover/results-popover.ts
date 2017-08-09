import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CandidateVote } from '../../models/candidate-vote';

@IonicPage()
@Component({
  selector: 'page-results-popover',
  templateUrl: 'results-popover.html',
})
export class ResultsPopoverPage {
  acName: string;
  acResults: CandidateVote[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.acName = this.navParams.get('acName');
    this.acResults = this.navParams.get('acResults');
  }


}
