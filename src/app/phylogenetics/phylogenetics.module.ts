import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhylogeneticsComponent } from './phylogenetics/phylogenetics.component';
import { PhylogeneticsRoutingModule } from './phylogenetics-routing.module';
import { DynamicScriptLoaderService } from './phylogenetics/services/dynamic-script-loader.service';
import { LOADERS } from 'ngx-spinner/lib/ngx-spinner.enum';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatRadioModule} from '@angular/material/radio';



@NgModule({
  declarations: [PhylogeneticsComponent],
    imports: [
        PhylogeneticsRoutingModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatRadioModule,
        NgxSpinnerModule
    ],
  providers: [
    DynamicScriptLoaderService
  ]
})
export class PhylogeneticsModule { }
