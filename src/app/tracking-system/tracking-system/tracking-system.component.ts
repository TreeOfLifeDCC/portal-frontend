import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  ViewChild
} from '@angular/core';

import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {merge, of as observableOf} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {MatCard, MatCardActions, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";

import {MatLine} from "@angular/material/core";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {NgClass, NgForOf, NgStyle} from '@angular/common';
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef,
  MatNoDataRow, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {Router, RouterLink} from '@angular/router';
import {MatAnchor} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {HttpClient} from "@angular/common/http";
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-tracking-system',
  templateUrl: './tracking-system.component.html',
  styleUrls: ['./tracking-system.component.css'],
  standalone:true,
    imports: [

        MatCard,
        MatCardTitle,
        MatCardActions,
        MatListItem,
        MatList,
        MatLine,
        MatChipSet,
        MatChip,
        NgForOf,
        MatIcon,
        MatProgressSpinner,

        MatTable,
        RouterLink,
        MatHeaderCell,
        MatColumnDef,
        MatSortHeader,
        MatCell,
        MatHeaderCellDef,
        MatCellDef,
        MatPaginator,
        MatNoDataRow,
        MatSort,
        MatAnchor,
        MatHeaderRow,
        MatRow,
        MatInput,
        MatLabel,
        MatFormField,
        MatHeaderRowDef,
        MatRowDef,
        NgClass,
        NgStyle
    ]
})
export class TrackingSystemComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['organism', 'commonName', 'biosamples', 'raw_data', 'assemblies_status',
      'annotation_complete'];
  data: any;
  searchValue: string;
  searchChanged = new EventEmitter<any>();
  filterChanged = new EventEmitter<any>();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  aggregations: any;
  filters: any;

  activeFilters = new Array<string>();

  currentStyle: string;
  currentClass = 'kingdom';
  classes = ["superkingdom", "kingdom", "subkingdom", "superphylum", "phylum", "subphylum", "superclass", "class",
      "subclass", "infraclass", "cohort", "subcohort", "superorder", "order", "suborder", "infraorder", "parvorder",
      "section", "subsection", "superfamily", "family", " subfamily", " tribe", "subtribe", "genus", "series", "subgenus",
      "species_group", "species_subgroup", "species", "subspecies", "varietas", "forma"];
  timer: any;
  phylogenyFilters: string[] = [];
  symbiontsFilters: any[] = [];
  preventSimpleClick = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _apiService: ApiService,private router: Router) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
      // If the user changes the metadataSort order, reset back to the first page.
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
      this.searchChanged.subscribe(() => (this.paginator.pageIndex = 0));
      this.filterChanged.subscribe(() => (this.paginator.pageIndex = 0));
      merge(this.paginator.page, this.sort.sortChange, this.searchChanged, this.filterChanged)
          .pipe(
              startWith({}),
              switchMap(() => {
                  this.isLoadingResults = true;
                  return this._apiService.getData(this.paginator.pageIndex,
                      this.paginator.pageSize, this.searchValue, this.sort.active, this.sort.direction, this.activeFilters,
                      this.currentClass, this.phylogenyFilters, 'tracking_status_test'
                  ).pipe(catchError(() => observableOf(null)));
              }),
              map(data => {
                  // Flip flag to show that loading has finished.
                  this.isLoadingResults = false;
                  this.isRateLimitReached = data === null;

                  if (data === null) {
                      return [];
                  }

                  // Only refresh the result length if there is new metadataData. In case of rate
                  // limit errors, we do not want to reset the metadataPaginator to zero, as that
                  // would prevent users from re-triggering requests.
                  this.resultsLength = data.count;
                  this.aggregations = data.aggregations;



                  // symbionts
                  this.symbiontsFilters = [];
                  if (this.aggregations.symbionts_biosamples_status.buckets.length > 0) {
                      this.symbiontsFilters = this.merge(this.symbiontsFilters,
                          this.aggregations.symbionts_biosamples_status.buckets,
                          'symbionts_biosamples_status');
                  }
                  if (this.aggregations.symbionts_raw_data_status.buckets.length > 0) {
                      this.symbiontsFilters = this.merge(this.symbiontsFilters,
                          this.aggregations.symbionts_raw_data_status.buckets,
                          'symbionts_raw_data_status');
                  }
                  if (this.aggregations.symbionts_assemblies_status.buckets.length > 0) {
                      this.symbiontsFilters = this.merge(this.symbiontsFilters,
                          this.aggregations.symbionts_assemblies_status.buckets,
                          'symbionts_assemblies_status');
                  }

                  return data.results;
              }),
          )
          .subscribe(data => (this.data = data));
  }

  merge = (first: any[], second: any[], filterLabel: string) => {
      for (let i = 0; i < second.length; i++) {
          second[i].label = filterLabel;
          first.push(second[i]);
      }
      return first;
  }

    checkFilterIsActive = (filter: string) => {
        // console.log(this.filterService.activeFilters);
        if (this.activeFilters.indexOf(filter) !== -1) {
            return 'active-filter';
        }

    }
    getStatusCount(data: any) {
        if (data) {
            for (let i = 0; i < data.length; ++i) {
                if (data[i].key === 'Done') {
                    return data[i].doc_count;
                }
            }
        }
    }

  applyFilter(event: Event) {
      this.searchValue = (event.target as HTMLInputElement).value;
      this.searchChanged.emit();
  }


  onFilterClick(filterValue: string) {
      console.log('double click');
      this.preventSimpleClick = true;
      clearTimeout(this.timer);
      const index = this.activeFilters.indexOf(filterValue);
      index !== -1 ? this.activeFilters.splice(index, 1) : this.activeFilters.push(filterValue);
      this.filterChanged.emit();
  }

  checkStyle(filterValue: string) {
      if (this.activeFilters.includes(filterValue)) {
          return 'background-color: #A8BAA8';
      } else {
          return '';
      }
  }

  displayActiveFilterName(filterName: string) {
      if (filterName.startsWith('symbionts_')) {
          return 'Symbionts-' + filterName.split('-')[1]
      }
      return filterName;
  }

  changeCurrentClass(filterValue: string) {
      console.log('single click');
      let delay = 200;
      this.preventSimpleClick = false;
      this.timer = setTimeout(() => {
          if (!this.preventSimpleClick) {
              this.phylogenyFilters.push(`${this.currentClass}:${filterValue}`);
              const index = this.classes.indexOf(this.currentClass) + 1;
              this.currentClass = this.classes[index];
              console.log(this.phylogenyFilters);
              this.filterChanged.emit();
          }
      }, delay);
  }

  onHistoryClick() {
      this.phylogenyFilters.splice(this.phylogenyFilters.length - 1, 1);
      const previousClassIndex = this.classes.indexOf(this.currentClass) - 1;
      this.currentClass = this.classes[previousClassIndex];
      this.filterChanged.emit();
  }

  onRefreshClick() {
      this.phylogenyFilters = [];
      this.currentClass = 'kingdom';
      this.filterChanged.emit();
  }


  getStyle(status: string) {
      if (status === 'Done') {
          return 'background-color: #A8BAA8; color: black';
      } else {
          return 'background-color: #D8BCAA; color: black';
      }
  }
    removeFilter() {
        this.preventSimpleClick = true;
        clearTimeout(this.timer);
        this.activeFilters = [];
        this.phylogenyFilters = [];
        this.currentClass = 'kingdom';
        this.filterChanged.emit();

    }

    getStatusStyle(status: string) {
        if (status !== undefined) {
            if (status.toLowerCase().includes('waiting')) {
                return ['#FFC107', 'dark_text_chip'];
            } else {
                return ['#8FBC45', 'white_text_chip'];
            }
        }
    }



}
