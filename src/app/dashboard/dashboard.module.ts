import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
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
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { DashboardService } from '../dashboard/services/dashboard.service';
import { OrganismDetailsComponent } from './component/organism-details/organism-details.component';
import { TaxanomyComponent } from '../taxanomy/taxanomy.component';
import { TaxanomyService } from '../taxanomy/taxanomy.service';
import {MatTabsModule} from '@angular/material/tabs';
import { MapComponent } from './map/map.component';
import { MapClusterComponent } from './map-cluster/map-cluster.component';
import {FilterComponent} from '../shared/filter/filter.component';
import {PhylogenyFilterComponent} from '../shared/phylogeny-filter/phylogeny-filter.component';
import {ActiveFilterComponent} from '../shared/active-filter/active-filter.component';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import { ImageSliderComponent } from '../image-slider/image-slider.component';





@NgModule({
  declarations: [DashboardComponent, SpecimensComponent, DetailsComponent, OrganismDetailsComponent, TaxanomyComponent, MapComponent,
    MapClusterComponent, FilterComponent, PhylogenyFilterComponent, ActiveFilterComponent],
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
    MatCheckboxModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule,
    MatRadioModule,
    MatChipsModule,
    ImageSliderComponent
  ],
  exports: [
    FilterComponent, PhylogenyFilterComponent, ActiveFilterComponent
  ],
  providers: [DashboardService, TaxanomyService],
})
export class DashboardModule { }
