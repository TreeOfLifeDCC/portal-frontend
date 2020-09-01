import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingSystemComponent } from './tracking-system/tracking-system.component';
import {TrackingSystemRoutingModule} from './tracking-system-routing.module';



@NgModule({
  declarations: [TrackingSystemComponent],
  imports: [
    CommonModule,
      TrackingSystemRoutingModule
  ]
})
export class TrackingSystemModule { }
