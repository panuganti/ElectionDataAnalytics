import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConstituenciesPopoverPage } from './constituencies-popover';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ConstituenciesPopoverPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ConstituenciesPopoverPage),
  ],
  exports: [
    ConstituenciesPopoverPage
  ]
})
export class ConstituenciesPopoverPageModule {}
