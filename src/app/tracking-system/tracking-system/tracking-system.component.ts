import {
    AfterViewInit,
    Component,
    EventEmitter, inject,
    OnInit,
    ViewChild
} from '@angular/core';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatCard, MatCardActions, MatCardTitle} from '@angular/material/card';
import {MatList, MatListItem} from '@angular/material/list';

import {MatLine} from '@angular/material/core';
import {MatChip, MatChipSet} from '@angular/material/chips';
import { NgClass, NgStyle } from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef,
  MatNoDataRow, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import { ApiService } from 'src/app/api.service';
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-tracking-system',
  templateUrl: './tracking-system.component.html',
  styleUrls: ['./tracking-system.component.css'],
  standalone: true,
    imports: [
        MatCard,
        MatCardTitle,
        MatCardActions,
        MatListItem,
        MatList,
        MatLine,
        MatChipSet,
        MatChip,
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
        NgStyle,
        MatButton,
        MatProgressBar
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
  queryParams: any = {};
  lastPhylogenyVal = '';
  isPhylogenyFilterProcessing = false; // Flag to prevent double-clicking

  currentStyle: string;
  currentClass = 'kingdom';
  classes = ['superkingdom', 'kingdom', 'subkingdom', 'superphylum', 'phylum', 'subphylum', 'superclass', 'class',
      'subclass', 'infraclass', 'cohort', 'subcohort', 'superorder', 'order', 'suborder', 'infraorder', 'parvorder',
      'section', 'subsection', 'superfamily', 'family', ' subfamily', ' tribe', 'subtribe', 'genus', 'series', 'subgenus',
      'species_group', 'species_subgroup', 'species', 'subspecies', 'varietas', 'forma'];
  timer: any;
  phylogenyFilters: string[] = [];
  symbiontsFilters: any[] = [];
  displayProgressBar = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private activatedRoute = inject(ActivatedRoute);

  constructor(private _apiService: ApiService, private router: Router) {
  }

  ngOnInit(): void {
      // reload page if user clicks on menu link
      this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
              if (event.urlAfterRedirects === '/tracking') {
                  this.refreshPage();
              }
          }
      });

      // get url parameters
      const queryParamMap = this.activatedRoute.snapshot['queryParamMap'];
      const params = queryParamMap['params'];
      if (Object.keys(params).length !== 0) {
          for (const key in params) {
              if (params.hasOwnProperty(key)) {
                  if (params[key].includes('phylogenyFilters - ')) {
                      const phylogenyFilters = params[key].split('phylogenyFilters - ')[1];
                      // Remove square brackets and split by comma
                      this.phylogenyFilters = phylogenyFilters.slice(1, -1).split(',');
                  } else if (params[key].includes('phylogenyCurrentClass - ')) {
                      const phylogenyCurrentClass = params[key].split('phylogenyCurrentClass - ')[1];
                      this.currentClass = phylogenyCurrentClass;
                  } else {
                      this.activeFilters.push(params[key]);
                  }

              }
          }
      }

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
                      this.currentClass, this.phylogenyFilters, 'tracking_status'
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
                  // get last phylogeny element for filter button
                  this.lastPhylogenyVal = this.phylogenyFilters.slice(-1)[0];

                  // add filters to URL query parameters
                  this.queryParams = [...this.activeFilters];
                  if (this.phylogenyFilters && this.phylogenyFilters.length) {
                      const index = this.queryParams.findIndex(element => element.includes('phylogenyFilters - '));
                      if (index > -1) {
                          this.queryParams[index] = `phylogenyFilters - [${this.phylogenyFilters}]`;
                      } else {
                          this.queryParams.push(`phylogenyFilters - [${this.phylogenyFilters}]`);
                      }
                  }

                  // update url with the value of the phylogeny current class
                  this.updateQueryParams('phylogenyCurrentClass');

                  this.replaceUrlQueryParams();
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

    updateQueryParams(urlParam: string){
        if (urlParam === 'phylogenyCurrentClass'){
            const queryParamIndex = this.queryParams.findIndex((element: any) => element.includes('phylogenyCurrentClass - '));
            if (queryParamIndex > -1) {
                this.queryParams[queryParamIndex] = `phylogenyCurrentClass - ${this.currentClass}`;
            } else {
                this.queryParams.push(`phylogenyCurrentClass - ${this.currentClass}`);
            }
        }
    }

    onFilterClick(filterValue: string, phylogenyFilter: boolean = false) {
        if (phylogenyFilter) {
            if (this.isPhylogenyFilterProcessing) {
                return;
            }
            // Set flag to prevent further clicks
            this.isPhylogenyFilterProcessing = true;

            this.phylogenyFilters.push(`${this.currentClass}:${filterValue}`);
            const index = this.classes.indexOf(this.currentClass) + 1;
            this.currentClass = this.classes[index];

            // update url with the value of the phylogeny current class
            this.updateQueryParams('phylogenyCurrentClass');

            // Replace current parameters with new parameters.
            this.replaceUrlQueryParams();
            this.filterChanged.emit();

            // Reset isPhylogenyFilterProcessing flag
            setTimeout(() => {
                this.isPhylogenyFilterProcessing = false;
            }, 500);
        } else {
            clearTimeout(this.timer);
            const index = this.activeFilters.indexOf(filterValue);
            index !== -1 ? this.activeFilters.splice(index, 1) : this.activeFilters.push(filterValue);
            this.filterChanged.emit();
        }
    }

    removePhylogenyFilters() {
        // update url with the value of the phylogeny current class
        const queryParamPhyloIndex = this.queryParams.findIndex(element => element.includes('phylogenyFilters - '));
        if (queryParamPhyloIndex > -1) {
            this.queryParams.splice(queryParamPhyloIndex, 1);
        }

        const queryParamCurrentClassIndex = this.queryParams.findIndex(element => element.includes('phylogenyCurrentClass - '));
        if (queryParamCurrentClassIndex > -1) {
            this.queryParams.splice(queryParamCurrentClassIndex, 1);
        }
        // Replace current url parameters with new parameters.
        this.replaceUrlQueryParams();
        // reset phylogeny variables
        this.phylogenyFilters = [];
        this.currentClass = 'kingdom';
        this.filterChanged.emit();
    }

    replaceUrlQueryParams() {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: this.queryParams,
            replaceUrl: true,
            skipLocationChange: false
        });
    }

  checkStyle(filterValue: string) {
      if (this.activeFilters.includes(filterValue)) {
          return 'background-color: #A8BAA8';
      } else {
          return '';
      }
  }

  displayActiveFilterName(filterName: string) {
      if (filterName && filterName.startsWith('symbionts_')) {
          return 'Symbionts-' + filterName.split('-')[1];
      }
      return filterName;
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
        // remove phylogenyFilters param from url
        const index = this.queryParams.findIndex(element => element.includes('phylogenyFilters - '));
        if (index > -1) {
            this.queryParams.splice(index, 1);
            // Replace current parameters with new parameters.
            this.replaceUrlQueryParams();
        }
        this.filterChanged.emit();
    }

  getStyle(status: string) {
      if (status === 'Done') {
          return 'background-color: #A8BAA8; color: black';
      } else {
          return 'background-color: #D8BCAA; color: black';
      }
  }
    refreshPage() {
        clearTimeout(this.timer);
        this.activeFilters = [];
        this.phylogenyFilters = [];
        this.currentClass = 'kingdom';
        this.filterChanged.emit();

    }

    getStatusStyle(status: string) {
      if (status !== undefined) {
            if (status.toString().toLowerCase().includes('waiting')) {
                return ['#FFC107', 'dark_text_chip'];
            } else {
                return ['#8FBC45', 'white_text_chip'];
            }
        }
      // default background colour
      return ['#8FBC45', 'white_text_chip'];
    }


    downloadFile(downloadOption: string, dialog: boolean) {
        this.displayProgressBar = true;
        this._apiService.downloadData(downloadOption, this.paginator.pageIndex,
            this.paginator.pageSize, this.searchValue || '', this.sort.active, this.sort.direction, this.activeFilters,
            this.currentClass, this.phylogenyFilters, 'tracking_status').subscribe({
            next: (response: Blob) => {
                const blobUrl = window.URL.createObjectURL(response);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'download.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.displayProgressBar = false;
            },
            error: error => {
                console.error('Error downloading the CSV file:', error);
            },
            complete: () => {
                this.displayProgressBar = false;
            }
        });
    }



}
