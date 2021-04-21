import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { ApiComponent } from './api/api.component';

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
    path: '',
    children: [
      { path: 'data', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'tracking_system', loadChildren: () => import('./tracking-system/tracking-system.module').then(
          m => m.TrackingSystemModule)
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
