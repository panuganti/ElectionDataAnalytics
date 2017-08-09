import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResultsPopoverPage } from './results-popover';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ResultsPopoverPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ResultsPopoverPage),
  ],
  exports: [
    ResultsPopoverPage
  ]
})
export class ResultsPopoverPageModule {}
