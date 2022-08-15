import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Sample} from "../model/dashboard.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Taxonomy} from "../../taxanomy/taxonomy.model";
import {Title} from "@angular/platform-browser";
import {DashboardService} from "../services/dashboard.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {TaxanomyService} from "../../taxanomy/taxanomy.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  DownloadConfirmationDialogComponent
} from "../../download-confirmation-dialog-component/download-confirmation-dialog.component";
import {FilterService} from "../../shared/filter-service";

@Component({
  selector: 'app-active-filter',
  templateUrl: './active-filter.component.html',
  styleUrls: ['./active-filter.component.css']
})
export class ActiveFilterComponent {
  aggs = [];
  data = {};

  constructor(private filterService: FilterService) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.aggs = this.filterService.activeFilters;
    this.data = this.filterService.data;
    this.filterService.field.subscribe(data => {
      this.aggs = this.filterService.activeFilters;
      this.data = this.filterService.data;
    });
  }

  // tslint:disable-next-line:typedef
  clearFilter(field: string) {
    const index = this.filterService.activeFilters.indexOf(field);
    this.filterService.activeFilters.splice(index, 1);
    for (const key of Object.keys(this.data)) {
      // tslint:disable-next-line:variable-name
      const my_index = this.data[key].indexOf(field);
      if (my_index > -1) {
        this.data[key].splice(my_index, 1);
      }
    }
    this.filterService.field.next(this.data);
  }
}
