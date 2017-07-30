import { Component } from '@angular/core';

/**
 * Generated class for the ResultsSettingsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'results-settings',
  templateUrl: 'results-settings.html'
})
export class ResultsSettingsComponent {

  text: string;

  constructor() {
    console.log('Hello ResultsSettingsComponent Component');
    this.text = 'Hello World';
  }

}
