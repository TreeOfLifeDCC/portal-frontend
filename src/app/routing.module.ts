import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {DashboardComponent} from './dashboard/component/dashboard.component';

import { BulkDownloadsComponent } from './bulk-downloads/bulk-downloads.component';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { LookerDashboardsComponent } from './looker-dashboards/looker-dashboards.component';
import { GisComponent } from './gis/gis.component';
import { PublicationsComponent } from './publications/publications.component';
import { PhylogeneticsComponent } from './phylogenetics/phylogenetics/phylogenetics.component';
import { ApiComponent } from './api/api.component';
import { TrackingSystemComponent } from './tracking-system/tracking-system/tracking-system.component';
import {DataPortalDetailsComponent} from './data-portal-details/data-portal-details.component';
import {SpecimenDetailsComponent} from './specimens/specimens.component';
import {OrganismDetailsComponent} from './organism-details/organism-details.component';


export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'data' , component: DashboardComponent
  },
  { path: 'data/:id', component: DataPortalDetailsComponent },
  {
    path: 'bulk-downloads' , component: BulkDownloadsComponent
  },
  {
    path: 'help', component: HelpComponent
  },
  {
    path: 'about', component: AboutComponent
  },
  {
    path: 'gis', component: GisComponent
  },
  {
    path: 'dashboards', component: LookerDashboardsComponent
  },
  {
    path: 'tree', component: PhylogeneticsComponent
  },
  {
    path: 'publications', component: PublicationsComponent
  },
  {
    path: 'documentation',
    component: ApiComponent
  },
  {
    path: 'tracking' , component: TrackingSystemComponent
  },
  {
    path: 'specimen/:specimenId',
    component: SpecimenDetailsComponent,
    title: 'Specimen'
  },
  {
    path:  'organism/:organismId',
    component : OrganismDetailsComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class RoutingModule { }
