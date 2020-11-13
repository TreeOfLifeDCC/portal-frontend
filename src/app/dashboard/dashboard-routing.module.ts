import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './component/dashboard.component';
import { DetailsComponent } from './component/details/details.component';
import {SpecimensComponent} from './specimens/specimens.component';

const routes: Routes = [
    // { path: '', redirectTo: 'organisms', pathMatch: 'full' },
    { path : '', component: DashboardComponent },
    { path: 'specimens', component: SpecimensComponent},
    { path : 'details/:id', component: DetailsComponent },

    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
