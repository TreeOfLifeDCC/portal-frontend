import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackingSystemComponent } from './tracking-system/tracking-system.component';

const routes: Routes = [{ path: '', component: TrackingSystemComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrackingSystemRoutingModule { }
