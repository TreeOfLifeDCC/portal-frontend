import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingSystemComponent } from './tracking-system/tracking-system.component';
import {TrackingSystemRoutingModule} from './tracking-system-routing.module';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { DetailsComponent } from './tracking-system/details/details.component';
import {MatListModule} from "@angular/material/list";



@NgModule({
  declarations: [TrackingSystemComponent, DetailsComponent],
  imports: [
    CommonModule,
    TrackingSystemRoutingModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule
  ]
})
export class TrackingSystemModule { }
