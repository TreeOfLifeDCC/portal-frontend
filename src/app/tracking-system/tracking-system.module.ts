import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingSystemComponent } from './tracking-system/tracking-system.component';
import {TrackingSystemRoutingModule} from './tracking-system-routing.module';
import {FormsModule} from '@angular/forms';
import {MatButtonModule as MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule as MatTableModule} from '@angular/material/table';
import {MatTooltipModule as MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule as MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule as MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule as MatInputModule} from '@angular/material/input';
import { DetailsComponent } from './tracking-system/details/details.component';
import {MatListModule as MatListModule} from "@angular/material/list";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatTableExporterModule } from 'mat-table-exporter';



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
    MatListModule,
    NgxSpinnerModule,
    MatTableExporterModule
  ]
})
export class TrackingSystemModule { }
