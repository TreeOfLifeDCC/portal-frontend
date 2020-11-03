import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackingSystemComponent } from './tracking-system/tracking-system.component';
import {DetailsComponent} from './tracking-system/details/details.component';

const routes: Routes = [
    { path: '', component: TrackingSystemComponent },
    { path: ':id', component: DetailsComponent},
    { path: 'details/:organism', component: DetailsComponent },
    ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrackingSystemRoutingModule { }
