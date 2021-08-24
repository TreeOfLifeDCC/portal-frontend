import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhylogeneticsComponent } from './phylogenetics/phylogenetics.component';
import { PhylogeneticsRoutingModule } from './phylogenetics-routing.module';
import { DynamicScriptLoaderService } from './phylogenetics/services/dynamic-script-loader.service';
import { LOADERS } from 'ngx-spinner/lib/ngx-spinner.enum';



@NgModule({
  declarations: [PhylogeneticsComponent],
  imports: [
    PhylogeneticsRoutingModule,
    CommonModule
  ],
  providers: [
    DynamicScriptLoaderService
  ]
})
export class PhylogeneticsModule { }
