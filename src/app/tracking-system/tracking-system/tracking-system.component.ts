import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Sample, samples } from '../model/tracking-system.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-tracking-system',
  templateUrl: './tracking-system.component.html',
  styleUrls: ['./tracking-system.component.css']
})
export class TrackingSystemComponent implements OnInit, AfterViewInit {
  displayedColumns = ['organism', 'common_name', 'metadata_submitted_to_biosamples',
    'raw_data_submitted_to_ena', 'mapped_reads_submitted_to_ena', 'assemblies_submitted_to_ena',
    'annotation_submitted_to_ena'];
  dataSource = new MatTableDataSource<Sample>(samples);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  activeFilters = [];
  filters = {
    organism: {},
    common_name: {}
  };
  organismFilters = [];
  commonNameFilters = [];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Status tracking');
    this.dataSource.sort = this.sort;
    this.getFilters(samples);
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
  onFilterClick(filter: string) {
    this.activeFilters.push(filter);
    this.dataSource.filter = filter.trim().toLowerCase();
    this.getFilters(this.dataSource.filteredData);
  }

  // tslint:disable-next-line:typedef
  removeAllFilters() {
    this.activeFilters = [];
    this.dataSource.filter = undefined;
    this.getFilters(samples);
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
      this.getFilters(samples);
    }
  }

  // tslint:disable-next-line:typedef
  getFilters(data: any) {
    const filters = {
      organism: {},
      common_name: {}
    };
    for (const item of data) {
      if (item.organism in filters.organism) {
        filters.organism[item.organism] += 1;
      } else {
        filters.organism[item.organism] = 1;
      }
      if (item.common_name in filters.common_name) {
        filters.common_name[item.common_name] += 1;
      } else {
        filters.common_name[item.common_name] = 1;
      }
    }
    this.filters = filters;
    this.organismFilters = Object.entries(this.filters.organism);
    this.commonNameFilters = Object.entries(this.filters.common_name);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
