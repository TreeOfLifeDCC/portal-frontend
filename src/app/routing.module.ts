import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DataPortalComponent} from './data-portal/data-portal.component';
import { HomeComponent } from './home/home.component';
import {DashboardComponent} from './dashboard/component/dashboard.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'data' , component: DashboardComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class RoutingModule { }
