import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource as MatTableDataSource} from '@angular/material/table';
import {MatPaginator as MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Title} from '@angular/platform-browser';
import {NgxSpinnerService} from 'ngx-spinner';
import {GetDataService} from '../services/get-data.service';
import {FilterService} from '../services/filter-service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataCount = 0;

  pagesize = 20;

  columns = ['title', 'journal_name', 'year', 'organism_name', 'study_id'];

  constructor(private titleService: Title,
              private spinner: NgxSpinnerService,
              private getDataService: GetDataService,
              private filterService: FilterService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle('Publications');
    const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
    const params = queryParamMap['params'];
    if (Object.keys(params).length !== 0) {
      this.resetFilter();
      for (const key in params) {
        this.filterService.urlAppendFilterArray.push({name: key, value: params[key]});
        this.filterService.activeFilters.push(params[key]);
      }
    }
    this.getAllPublications(0, this.pagesize, this.sort.active, this.sort.direction);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getAllPublications(offset, limit, sortColumn?, sortOrder?): void {
    this.spinner.show();
    this.getDataService.getAllPublications(offset, limit, this.filterService.activeFilters).subscribe(
        data => {
          this.dataSource = data.results;
          this.dataCount = data.count;
          this.filterService.getFilters(data);
          this.spinner.hide();
        }
    );
  }

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

  pageChanged(event: any): void {
    const offset = event.pageIndex * event.pageSize;
    this.getAllPublications(offset, event.pageSize);
  }

  customSort(event: any): void {
    console.log(event);
  }

  hasActiveFilters(): boolean {
    if (typeof this.filterService.activeFilters === 'undefined') {
      return false;
    }
    for (const key of Object.keys(this.filterService.activeFilters)) {
      if (this.filterService.activeFilters[key].length !== 0) {
        return true;
      }
    }
    return false;
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
    for (const key of Object.keys(this.filterService.activeFilters)) {
      this.filterService.activeFilters[key] = [];
    }
    this.filterService.activeFilters = [];
    this.filterService.urlAppendFilterArray = [];
    this.filterService.isFilterSelected = false;
    this.filterService.phylSelectedRank = '';
    this.filterService.selectedFilterValue = '';
  }

  ngOnDestroy(): void {
    this.resetFilter();
  }

}
