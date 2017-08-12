import { Input, Component } from '@angular/core';
import { BoothResult, Candidate } from '../../models/booth-result';
import { DataProvider } from '../../providers/data';
import * as Enumerable from 'linq';

@Component({
  selector: 'booth-info',
  templateUrl: 'booth-info.html',
  providers: [DataProvider]
})
export class BoothInfoComponent {

  @Input() booth: any;
  @Input() boothResult: BoothResult;
  @Input() booth1Result: BoothResult;
  @Input() booth2Result: BoothResult;

  @Input() showBoothResult: boolean;  
  @Input() showBooth1Result: boolean;
  @Input() showBooth2Result: boolean;

  constructor(public data: DataProvider) {
  }

  show: boolean = true;
  toggle() {
    this.show = !this.show;
  }

  getBkgndColor(i: number) {
    return (i & 1) ? "white" : "lightgreen";
  }

  issues: string[] = ["Water", "Electricty", "Road", "Law & Order", "Unemployment"];
  showBoothIssue: boolean = true;
  boothIssue: string;
  getBoothIssue() {
    if (!this.booth) {return;}
    let boothId = this.booth.properties.booth;
    let index = parseInt(boothId) % 4;
    this.boothIssue = this.issues[index];
    return this.boothIssue;
  }

  showBoothPrediction: boolean = true;
  winners: string[] = ["BJP", "BJP", "BJP", "BJP", "INC", "INC", "INC", "JD(s)", "Undecided"];
  winner: string;
  getBoothPrediction() {
    if (!this.booth) {return;}
    let boothId = this.booth.properties.booth;
    let index = parseInt(boothId) % 8;
    this.winner = this.winners[index];
    return this.winner;
  }

  getBoothName() {
    if (this.booth) {
      return this.booth.properties.booth_name;
    }
  }


}
