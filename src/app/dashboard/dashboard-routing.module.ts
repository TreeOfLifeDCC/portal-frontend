import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './component/dashboard.component';
import {SpecimensComponent} from './specimens/specimens.component';

const routes: Routes = [
    { path: '', redirectTo: 'organisms', pathMatch: 'full' },
    { path : 'organisms', component: DashboardComponent },
    { path: 'specimens', component: SpecimensComponent},
    { path : 'details/:id', component: DashboardComponent },

    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
