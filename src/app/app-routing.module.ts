import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/component/dashboard.component';

const routes: Routes = [
  // Main redirect
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }
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
