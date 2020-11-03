import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Title} from '@angular/platform-browser';
import {StatusesService} from "../services/statuses.service";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-tracking-system',
  templateUrl: './tracking-system.component.html',
  styleUrls: ['./tracking-system.component.css']
})
export class TrackingSystemComponent implements OnInit, AfterViewInit {
  displayedColumns = ['organism', 'commonName', 'metadata_submitted_to_biosamples',
    'raw_data_submitted_to_ena', 'mapped_reads_submitted_to_ena', 'assemblies_submitted_to_ena',
    'annotation_complete', 'annotation_submitted_to_ena'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  activeFilters = [];
  filters = {
    biosamples: {},
    raw_data: {},
    mapped_reads: {},
    assemblies: {},
    annotation: {},
    annotation_complete: {}
  };
  BiosamplesFilters = [];
  RawDataFilters = [];
  MappedReadsFilters = [];
  AssembliesFilters = [];
  AnnotationFilters = [];
  AnnotationCompleteFilters = [];
  unpackedData;

  constructor(private titleService: Title, private statusesService: StatusesService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Status tracking');
    this.getAllStatuses();
  }

  // tslint:disable-next-line:typedef
  getAllStatuses() {
    this.statusesService.getAllStatuses()
        .subscribe(
            data => {
              const unpackedData = [];
            for (const item of data.biosampleStatus) {
                unpackedData.push(this.unpackData(item));
                this.dataSource = new MatTableDataSource<any>(unpackedData);
                this.getFilters(unpackedData);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.filterPredicate = this.filterPredicate;
                this.unpackedData = unpackedData;
              }
            },
            err => console.log(err)
        );
  }

  filterPredicate(data: any, filterValue: any): boolean {
    const filters = filterValue.split('|');
    if (filters[1] === 'Metadata submitted to BioSamples') {
      return data.biosamples === filters[0].split(' - ')[1];
    } else {
      const ena_filters = filters[0].split(' - ');
      if (ena_filters[0] === 'Raw Data') {
        return data.raw_data === ena_filters[1];
      } else if (ena_filters[0] === 'Mapped Reads') {
        return data.mapped_reads === ena_filters[1];
      } else if (ena_filters[0] === 'Assemblies') {
        return data.assemblies === ena_filters[1];
      } else if (ena_filters[0] === 'Annotation complete') {
        return data.annotation_complete === ena_filters[1];
      } else if (ena_filters[0] === 'Annotation') {
        return data.annotation === ena_filters[1];
      }
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
      this.dataSource.filter = `${filter.trim()}|${label}`;
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
      const filterValueFormatted = filter.split(' - ')[1];
      this.dataSource.filter = filterValueFormatted.trim().toLowerCase();
      this.getFilters(this.dataSource.filteredData);
    } else {
      this.dataSource.filter = undefined;
      this.getFilters(this.unpackedData);
    }
  }

  // tslint:disable-next-line:typedef
  getFilters(data: any) {
    const filters = {
      biosamples: {},
      raw_data: {},
      mapped_reads: {},
      assemblies: {},
      annotation: {},
      annotation_complete: {}
    };
    for (const item of data) {
      const biosamples = `BioSamples - ${item.biosamples}`;
      const rawData = `Raw Data - ${item.raw_data}`;
      const mappedReads = `Mapped Reads - ${item.mapped_reads}`;
      const assemblies = `Assemblies - ${item.assemblies}`;
      const annotation = `Annotation - ${item.annotation}`;
      const annotationComplete = `Annotation complete - ${item.annotation_complete}`;
      if (biosamples in filters.biosamples) {
        filters.biosamples[biosamples] += 1;
      } else {
        filters.biosamples[biosamples] = 1;
      }
      if (rawData in filters.raw_data) {
        filters.raw_data[rawData] += 1;
      } else {
        filters.raw_data[rawData] = 1;
      }
      if (mappedReads in filters.mapped_reads) {
        filters.mapped_reads[mappedReads] += 1;
      } else {
        filters.mapped_reads[mappedReads] = 1;
      }
      if (assemblies in filters.assemblies) {
        filters.assemblies[assemblies] += 1;
      } else {
        filters.assemblies[assemblies] = 1;
      }
      if (annotation in filters.annotation) {
        filters.annotation[annotation] += 1;
      } else {
        filters.annotation[annotation] = 1;
      }
      if (annotationComplete in filters.annotation_complete) {
        filters.annotation_complete[annotationComplete] += 1;
      } else {
        filters.annotation_complete[annotationComplete] = 1;
      }
    }
    this.filters = filters;
    this.BiosamplesFilters = Object.entries(this.filters.biosamples);
    this.RawDataFilters = Object.entries(this.filters.raw_data);
    this.MappedReadsFilters = Object.entries(this.filters.mapped_reads);
    this.AssembliesFilters = Object.entries(this.filters.assemblies);
    this.AnnotationFilters = Object.entries(this.filters.annotation);
    this.AnnotationCompleteFilters = Object.entries(this.filters.annotation_complete);
  }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // tslint:disable-next-line:typedef
  getBadgeClass(status: string) {
    if (status === 'Done') {
      return 'badge badge-pill badge-success';
    } else {
      return 'badge badge-pill badge-warning';
    }
  }

  // tslint:disable-next-line:typedef
  generateLink(organism) {
    return `https://portal.darwintreeoflife.org/dashboard/organisms/details/${organism}`;
  }

}
