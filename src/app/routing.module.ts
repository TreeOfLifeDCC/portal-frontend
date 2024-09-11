import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {DashboardComponent} from './dashboard/component/dashboard.component';
import { OrganismDetailsComponent } from './dashboard/component/organism-details/organism-details.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'data' , component: DashboardComponent
  },
  { path: 'data/:id', component: OrganismDetailsComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class RoutingModule { }
