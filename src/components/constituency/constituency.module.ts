import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConstituencyComponent } from './constituency';

@NgModule({
  declarations: [
    ConstituencyComponent,
  ],
  imports: [
    IonicPageModule.forChild(ConstituencyComponent),
  ],
  exports: [
    ConstituencyComponent
  ]
})
export class ConstituencyComponentModule {}
