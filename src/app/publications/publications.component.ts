import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {Title} from '@angular/platform-browser';
import {NgxSpinnerService} from 'ngx-spinner';
import {GetDataService} from '../services/get-data.service';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { MatCard, MatCardActions, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatLine } from '@angular/material/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatInput } from '@angular/material/input';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  standalone : true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardActions,
    MatList,
    MatListItem,
    MatChipSet,
    MatLine,
    MatChip,
    MatIcon,
    MatProgressSpinner,
    MatLabel,
    MatFormField,
    MatTable,
    MatSort,
    MatHeaderCellDef,
    RouterLink,
    MatHeaderCell,
    MatCell,
    MatAnchor,
    MatColumnDef,
    MatPaginator,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
    MatCellDef,
    MatButton,
    MatInput,
    MatSortHeader,
    MatProgressSpinner,
    MatExpansionModule,
    MatCheckboxModule
]
})
export class PublicationsComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterChanged = new EventEmitter<any>();
  data: any;
  dataCount = 0;

  pagesize = 20;
  urlAppendFilterArray = []
  activeFilters = new Array<string>();
  columns = ['title', 'journal_name', 'year', 'organism_name', 'study_id'];
  journalNameFilters = [];
  publicationYearFilters = [];
  articleTypeFilters = [];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  aggregations: any;
  resultsLength: any;
  timer: any;
  constructor(private titleService: Title,
              private spinner: NgxSpinnerService,
              private getDataService: GetDataService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle('Publications');
    const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
    const params = queryParamMap['params'];
    if (Object.keys(params).length !== 0) {
      this.resetFilter();
      for (const key in params) {
        this.urlAppendFilterArray.push({name: key, value: params[key]});
        this.activeFilters.push(params[key]);
      }
    }
    // this.getAllPublications(0, this.pagesize, this.sort.active, this.sort.direction);
  }

  ngAfterViewInit() {
    // If the user changes the metadataSort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.filterChanged.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page, this.sort.sortChange,this.filterChanged)
        .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              return  this.getDataService.getAllPublications(0, this.pagesize, this.activeFilters)
              .pipe(catchError(() => observableOf(null)));
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;
              this.isRateLimitReached = data === null;

              if (data === null) {
                return [];
              }
              this.resultsLength = data.count;
              this.aggregations = data.aggregations;
    
              
              this.dataSource = data.results;
              this.dataCount = data.count;
              this.publicationYearFilters = data.aggregations.pubYear?.buckets;
              console.log(this.publicationYearFilters)
              this.journalNameFilters = data.aggregations.journalTitle?.buckets;
              this.articleTypeFilters = data.aggregations.articleType?.buckets;

              this.router.navigate([], {
                relativeTo: this.activatedRoute, queryParams:this.activeFilters,queryParamsHandling: 'merge'
              })
              return data.results;
            }),
        )
        .subscribe(data => (this.data = data));
  }

  // getAllPublications(offset, limit, sortColumn?, sortOrder?): void {
  //   this.spinner.show();
  //   this.getDataService.getAllPublications(offset, limit, this.activeFilters).subscribe(
  //       data => {
  //         this.dataSource = data.results;
  //         this.dataCount = data.count;
  //         this.publicationYearFilters = data.aggregations.pubYear?.buckets;
  //         this.journalNameFilters = data.aggregations.journalTitle?.buckets;
  //         this.articleTypeFilters = data.aggregations.articleType?.buckets;
  //         this.spinner.hide();
  //       }
  //   );
  // }

  getJournalName(data: any): string {
    if (data.journalTitle !== undefined) {
      return data.journalTitle;
    } else {
      return 'Wellcome Open Res';
    }
  }

  getYear(data: any): string {
    if (data.pubYear !== undefined) {
      return data.pubYear;
    } else {
      return '2022';
    }
  }

  // pageChanged(event: any): void {
  //   const offset = event.pageIndex * event.pageSize;
  //   this.getAllPublications(offset, event.pageSize);
  // }

  customSort(event: any): void {
    console.log(event);
  }

  hasActiveFilters(): boolean {
    if (typeof this.activeFilters === 'undefined') {
      return false;
    }
    for (const key of Object.keys(this.activeFilters)) {
      if (this.activeFilters[key].length !== 0) {
        return true;
      }
    }
    return false;
  }
  checkFilterIsActive = (filter: string) => {
    // console.log(this.filterService.activeFilters);
    if (this.activeFilters.indexOf(filter) !== -1) {
      return 'active-filter';
    }

  }
  onFilterClick(filterValue: string) {
    clearTimeout(this.timer);
    const index = this.activeFilters.indexOf(filterValue);
    index !== -1 ? this.activeFilters.splice(index, 1) : this.activeFilters.push(filterValue);
    this.filterChanged.emit();
  }


  removeFilter(): void {
    this.resetFilter();
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl.split('?')[0]] );
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 800);
    });
  }

  resetFilter(): void {
    for (const key of Object.keys(this.activeFilters)) {
      this.activeFilters[key] = [];
    }
    this.activeFilters = [];
    this.urlAppendFilterArray = [];

  }

  ngOnDestroy(): void {
    this.resetFilter();
  }

}

function observableOf(arg0: null): any {
  throw new Error('Function not implemented.');
}

