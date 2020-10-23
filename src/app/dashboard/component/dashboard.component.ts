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
  displayedColumns = ['accession', 'scientificName', 'organism', 'commonName', 'sex', 'trackingSystem'];
  bioSamples: Sample[];
  loading = true;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  activeFilters = [];
  filters = {
    sex: {},
    trackingSystem: {}
  };
  organismFilters = [];
  commonNameFilters = [];
  trackingSystemFilters = [];
  bioSampleObj;
  unpackedData;

  constructor(private titleService: Title, private dashboardService: DashboardService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getAllBiosamples();
    this.titleService.setTitle('Data portal');
  }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // tslint:disable-next-line:typedef
  getAllBiosamples() {
    this.dashboardService.getAllBiosample()
      .subscribe(
        data => {
          const unpackedData = [];
          for (const item of data.hits.hits) {
            unpackedData.push(this.unpackData(item));
          }
          this.dataSource = new MatTableDataSource<any>(unpackedData);
          this.getFilters(unpackedData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.filterPredicate;
          this.unpackedData = unpackedData;
        },
        err => console.log(err)
      );
  }

  // tslint:disable-next-line:typedef
  filterPredicate(data: any, filterValue: any): boolean {
    const filters = filterValue.split('|');
    if (filters[1] === 'Sex') {
      if (filters[0] !== 'undefined') {
        return data.sex === filters[0];
      } else {
        return data.sex !== 'male' && data.sex !== 'female';
      }
    } else if (filters[1] === 'Tracking Status') {
      return data.trackingSystem.toLowerCase() === filters[0];
    } else {
      return Object.values(data).join('').trim().toLowerCase().indexOf(filters[0]) !== -1;
    }
  }

  // tslint:disable-next-line:typedef
  unpackData(data: any) {
    const dataToReturn = {};
    if (data.hasOwnProperty('_source')) {
      data = data._source;
    }
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'object') {
        if (key === 'sex') {
          if (data.sex.length !== 0) {
            dataToReturn[key] = data.sex[0].text;
          } else {
            dataToReturn[key] = undefined;
          }
        }
      } else {
        dataToReturn[key] = data[key];
      }
    }
    return dataToReturn;
  }

  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // tslint:disable-next-line:typedef
  checkFilterIsActive(filter: string) {
    if (this.activeFilters.indexOf(filter) !== -1) {
      return 'active';
    }
  }

  // tslint:disable-next-line:typedef
  onFilterClick(label: string, filter: string) {
    const filterIndex = this.activeFilters.indexOf(filter);
    if (filterIndex !== -1) {
      this.removeFilter(filter);
    } else {
      this.activeFilters.push(filter);
      this.dataSource.filter = `${filter.trim().toLowerCase()}|${label}`;
      // this.dataSourceFiles = new MatTableDataSource<Sample>(this.dataSourceFiles.filteredData);
      this.getFilters(this.dataSource.filteredData);
    }
  }

  // tslint:disable-next-line:typedef
  removeAllFilters() {
    this.activeFilters = [];
    this.dataSource.filter = undefined;
    this.getFilters(this.unpackedData);
  }

  // tslint:disable-next-line:typedef
  removeFilter(filter: string) {
    const filterIndex = this.activeFilters.indexOf(filter);
    this.activeFilters.splice(filterIndex, 1);
    if (this.activeFilters.length !== 0) {
      this.dataSource.filter = this.activeFilters[0].trim().toLowerCase();
      this.getFilters(this.dataSource.filteredData);
    } else {
      this.dataSource.filter = undefined;
      this.getFilters(this.unpackedData);
    }
  }

  // tslint:disable-next-line:typedef
  getFilters(data: any) {
    const filters = {
      sex: {},
      trackingSystem: {}
    };
    for (const item of data) {
      if (item.sex in filters.sex) {
        filters.sex[item.sex] += 1;
      } else {
        filters.sex[item.sex] = 1;
      }
      if (item.trackingSystem in filters.trackingSystem) {
        filters.trackingSystem[item.trackingSystem] += 1;
      } else {
        filters.trackingSystem[item.trackingSystem] = 1;
      }
    }
    this.filters = filters;
    this.organismFilters = Object.entries(this.filters.sex);
    this.trackingSystemFilters = Object.entries(this.filters.trackingSystem);
  }

}
