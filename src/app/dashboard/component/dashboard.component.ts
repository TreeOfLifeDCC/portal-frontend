import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Location } from '@angular/common'; 
import { Router, ActivatedRoute } from '@angular/router';



import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Sample, samples } from '../model/dashboard.model';
import { DashboardService } from '../services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns = ['accession', 'organism', 'commonName', 'sex', 'trackingSystem'];
  bioSamples: Sample[];
  loading: boolean = true;
  dataSource = new MatTableDataSource<Sample>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  activeFilters = [];
  filters = {
    organism: {},
    common_name: {},
    trackingSystem: {}
  };
  organismFilters = [];
  commonNameFilters = [];
  trackingSystemFilters = [];
  bioSampleObj;

  constructor(private titleService: Title, private dashboardService: DashboardService, 
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getAllBiosamples(0, 10);
    this.titleService.setTitle('Dashboard');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllBiosamples(offset, limit) {
    this.dashboardService.getAllBiosample(offset, limit)
      .subscribe(
        data => {
          this.loading = false;
          this.bioSamples = data.biosamples;
          this.bioSamples.length = data.count;

          this.dataSource = new MatTableDataSource<Sample>(this.bioSamples);
          this.getFilters(this.bioSamples);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        err => console.log(err)
      )
  }

  getNextBiosamples(currentSize, offset, limit) {
    this.dashboardService.getAllBiosample(offset, limit)
      .subscribe(
        data => {
          this.loading = false;
          this.bioSamples.length = currentSize;
          this.bioSamples.push(...data.biosamples);
          this.bioSamples.length = data.count;
          this.dataSource = new MatTableDataSource<Sample>(this.bioSamples);
          this.dataSource._updateChangeSubscription();
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        err => console.log(err)
      )
  }

  pageChanged(event) {
    this.loading = true;

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;

    let previousSize = pageSize * pageIndex;

    this.getNextBiosamples(previousSize, (pageIndex).toString(), pageSize.toString());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkFilterIsActive(filter: string) {
    if (this.activeFilters.indexOf(filter) !== -1) {
      return 'active';
    }
  }

  onFilterClick(label: string, filter: string) {
    this.activeFilters.push(filter);
    this.dataSource.filter = filter.trim().toLowerCase();
    this.getFilters(this.dataSource.filteredData);
  }

  queryParamFilter(label, filter) {
    let params = new HttpParams(this.route.snapshot.queryParams)
      .append(label, filter);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        params
      },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
  }

  removeAllFilters() {
    this.activeFilters = [];
    this.dataSource.filter = undefined;
    this.getFilters(samples);
  }

  removeFilter(filter: string) {
    const filterIndex = this.activeFilters.indexOf(filter);
    this.activeFilters.splice(filterIndex, 1);
    if (this.activeFilters.length !== 0) {
      this.dataSource.filter = this.activeFilters[0].trim().toLowerCase();
      this.getFilters(this.dataSource.filteredData);
    } else {
      this.dataSource.filter = undefined;
      this.getFilters(samples);
    }
  }

  getFilters(data: any) {
    const filters = {
      organism: {},
      common_name: {},
      trackingSystem: {}
    };
    for (const item of data) {
      if (item.organism in filters.organism) {
        filters.organism[item.organism] += 1;
      } else {
        filters.organism[item.organism] = 1;
      }
      if (item.commonName in filters.common_name) {
        filters.common_name[item.commonName] += 1;
      } else {
        filters.common_name[item.commonName] = 1;
      }
      if (item.trackingSystem in filters.trackingSystem) {
        filters.trackingSystem[item.trackingSystem] += 1;
      } else {
        filters.trackingSystem[item.trackingSystem] = 1;
      }
    }
    this.filters = filters;
    this.organismFilters = Object.entries(this.filters.organism);
    this.commonNameFilters = Object.entries(this.filters.common_name);
    this.trackingSystemFilters = Object.entries(this.filters.trackingSystem);
  }

}
