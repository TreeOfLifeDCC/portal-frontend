import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingSystemComponent } from './tracking-system/tracking-system.component';
import {TrackingSystemRoutingModule} from './tracking-system-routing.module';
import {FormsModule} from '@angular/forms';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import { DetailsComponent } from './tracking-system/details/details.component';
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
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
