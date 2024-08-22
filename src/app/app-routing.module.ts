import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { ApiComponent } from './api/api.component';
import { GisComponent } from './gis/gis.component';
import {BulkDownloadsComponent} from './bulk-downloads/bulk-downloads.component';
import {PublicationsComponent} from './publications/publications.component';
import {LookerDashboardsComponent} from './looker-dashboards/looker-dashboards.component';
import {DataPortalComponent} from "./data-portal/data-portal.component";

const routes: Routes = [
  {
    path: 'documentation',
    component: ApiComponent
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'about', component: AboutComponent
  },
  {
    path: 'help', component: HelpComponent
  },
  {
    path: 'gis', component: GisComponent
  },
  {
    path: 'dashboards', component: LookerDashboardsComponent
  },
  {
    path: 'publications', component: PublicationsComponent
  },
  {
    path: 'bulk-downloads' , component: BulkDownloadsComponent
  },
  {
    path: 'data-portal' , component: DataPortalComponent
  },
  {
    path: '',
    children: [
      { path: 'data', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'tracking', loadChildren: () => import('./tracking-system/tracking-system.module').then(
          m => m.TrackingSystemModule)
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'tree', loadChildren: () => import('./phylogenetics/phylogenetics.module').then(
          m => m.PhylogeneticsModule)
      }
    ]
  },
  {
    path: '',
    children: [
      { path: '404', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
      { path: '**', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
