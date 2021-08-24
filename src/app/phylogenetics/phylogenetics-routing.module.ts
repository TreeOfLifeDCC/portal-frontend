import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PhylogeneticsComponent} from './phylogenetics/phylogenetics.component';

const routes: Routes = [
    { path: '', component: PhylogeneticsComponent }
    ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PhylogeneticsRoutingModule { }
