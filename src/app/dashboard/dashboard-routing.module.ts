import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './component/dashboard.component';
import { DetailsComponent } from './component/details/details.component';
import { OrganismDetailsComponent } from './component/organism-details/organism-details.component';
import { SpecimensComponent } from './specimens/specimens.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'specimens/details/:id', component: SpecimensComponent },
  { path: 'organism/details/:id', component: DetailsComponent },
  { path: 'root/details/:id', component: OrganismDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
