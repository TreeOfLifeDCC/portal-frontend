import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './component/dashboard.component';
import { SpecimensComponent } from './specimens/specimens.component';
import { DetailsComponent } from './component/details/details.component';

import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { DashboardService } from '../dashboard/services/dashboard.service';
import { OrganismDetailsComponent } from './component/organism-details/organism-details.component'
import { TaxanomyComponent } from '../taxanomy/taxanomy.component';
import { TaxanomyService } from '../taxanomy/taxanomy.service';

@NgModule({
  declarations: [DashboardComponent, SpecimensComponent, DetailsComponent, OrganismDetailsComponent, TaxanomyComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    NgxSpinnerModule,
    MatTableExporterModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [DashboardService, TaxanomyService]
})
export class DashboardModule { }
