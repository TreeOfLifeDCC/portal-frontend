import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { StatusesService } from "../services/statuses.service";
import { NgxSpinnerService } from 'ngx-spinner';

import 'jquery';

@Component({
  selector: 'app-tracking-system',
  templateUrl: './tracking-system.component.html',
  styleUrls: ['./tracking-system.component.css']
})
export class TrackingSystemComponent implements OnInit, AfterViewInit {
  displayedColumns = ['organism', 'commonName', 'metadata_submitted_to_biosamples',
    'raw_data_submitted_to_ena', 'mapped_reads_submitted_to_ena', 'assemblies_submitted_to_ena',
    'annotation_complete', 'annotation_submitted_to_ena'];
  orgDisplayedColumns = ['accession', 'organism', 'commonName', 'sex', 'organismPart', 'trackingSystem'];
  loading = true;
  dataSource = new MatTableDataSource<any>();
  orgDataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filtersMap;
  isBiosampleFilterCollapsed = true;
  isEnaFilterCollapsed = true;
  filterKeyName = '';
  itemLimitBiosampleFilter: number;
  itemLimitEnaFilter: number;
  filterSize: number;
  urlAppendFilterArray = [];
  searchText = '';


  activeFilters = [];
  BiosamplesFilters = [];
  RawDataFilters = [];
  MappedReadsFilters = [];
  AssembliesFilters = [];
  AnnotationFilters = [];
  AnnotationCompleteFilters = [];
  statusesTotalCount = 0;
  orgTotalCount = 0;
  unpackedData;
  showOrganismTable: boolean;
  orgName = '';

  constructor(private titleService: Title, private statusesService: StatusesService,
    private activatedRoute: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.showOrganismTable = false;
    this.activeFilters = [];
    this.urlAppendFilterArray = [];
    this.filterSize = 3;
    this.itemLimitBiosampleFilter = this.filterSize;
    this.itemLimitEnaFilter = this.filterSize;
    this.getFilters();
    this.titleService.setTitle('Status tracking');
    this.getStatusesQueryParamonInit();
  }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getStatusesQueryParamonInit() {
    const queryParamMap = this.activatedRoute.snapshot['queryParamMap'];
    const params = queryParamMap['params'];
    if (Object.keys(params).length != 0) {
      for (let key in params) {
        this.appendActiveFilters(key, params);
      }
      setTimeout(() => {
        this.getActiveFiltersAndResult();
      }, 1000);
    }
    else {
      this.getAllStatuses(0, 20, this.sort.active, this.sort.direction);
    }
  }

  appendActiveFilters(key, params) {
    setTimeout(() => {
      this.urlAppendFilterArray.push({ "name": key, "value": params[key] });
      this.activeFilters.push(params[key]);
    }, 10);
  }

  getActiveFiltersAndResult() {
    this.statusesService.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 20)
      .subscribe(
        data => {
          const unpackedData = [];
          for (const item of data.hits.hits) {
            unpackedData.push(this.unpackData(item));
          }
          this.statusesTotalCount = data.hits.total.value;
          this.dataSource = new MatTableDataSource<any>(unpackedData);
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.filterPredicate;
          this.unpackedData = unpackedData;
          for (let i = 0; i < this.urlAppendFilterArray.length; i++) {
            setTimeout(() => {
              let inactiveClassName = '.' + this.urlAppendFilterArray[i].name + '-inactive';
              let element = "li:contains('" + this.urlAppendFilterArray[i].value + "')";
              $(inactiveClassName).addClass('non-disp');
              $(element).removeClass('non-disp');
              $(element).addClass('disp');
              $(element).addClass('active');
            }, 1);

            if (i == (this.urlAppendFilterArray.length - 1)) {
              this.spinner.hide();
            }
          }

        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      )
  }

  // tslint:disable-next-line:typedef
  getAllStatuses(offset, limit, sortColumn?, sortOrder?) {
    this.spinner.show();
    this.statusesService.getAllStatuses(offset, limit, sortColumn, sortOrder)
      .subscribe(
        data => {
          const unpackedData = [];
          for (const item of data.biosampleStatus) {
            unpackedData.push(this.unpackData(item));
          }
          this.statusesTotalCount = data.count;
          this.dataSource = new MatTableDataSource<any>(unpackedData);
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.filterPredicate;
          this.unpackedData = unpackedData;
          setTimeout(() => {
            this.spinner.hide();
          }, 1000)
        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      );
  }

  getNextStatuses(currentSize, offset, limit, sortColumn?, sortOrder?) {
    this.spinner.show();
    this.statusesService.getAllStatuses(offset, limit, sortColumn, sortOrder)
      .subscribe(
        data => {
          const unpackedData = [];
          for (const item of data.biosampleStatus) {
            unpackedData.push(this.unpackData(item));
          }
          this.dataSource = new MatTableDataSource<any>(unpackedData);
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.filterPredicate;
          this.unpackedData = unpackedData;
          this.spinner.hide();
        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      )
  }

  pageChanged(event) {
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let previousSize = pageSize * pageIndex;

    let from = pageIndex * pageSize;
    let size = 0;
    if ((from + pageSize) < this.statusesTotalCount) {
      size = from + pageSize;
    }
    else {
      size = this.statusesTotalCount;
    }

    if (this.activeFilters.length !== 0) {
      this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, from, size);
    }
    else if (this.searchText.length !== 0) {
      this.getSearchResults(from, size);
    }
    else {
      this.getNextStatuses(previousSize, (pageIndex).toString(), pageSize.toString(), this.sort.active, this.sort.direction);
    }
  }

  orgPageChanged(event) {
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let previousSize = pageSize * pageIndex;

    let from = pageIndex * pageSize;
    let size = 0;
    if ((from + pageSize) < this.statusesTotalCount) {
      size = from + pageSize;
    }
    else {
      size = this.statusesTotalCount;
    }

    this.findBioSampleByOrganismName(this.orgName, from, size);
  }

  customSort(event) {
    let pageIndex = this.paginator.pageIndex;
    let pageSize = this.paginator.pageSize;
    let from = pageIndex * pageSize;
    let size = 0;
    if ((from + pageSize) < this.statusesTotalCount) {
      size = from + pageSize;
    }
    else {
      size = this.statusesTotalCount;
    }

    if (this.activeFilters.length !== 0) {
      this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, from, size);
    }
    else if (this.searchText.length !== 0) {
      this.getSearchResults(from, size);
    }
    else {
      this.getAllStatuses((pageIndex).toString(), pageSize.toString(), event.active, event.direction);
    }

  }

  orgSort(event) {
    let pageIndex = this.paginator.pageIndex;
    let pageSize = this.paginator.pageSize;
    let from = pageIndex * pageSize;
    let size = 0;
    if ((from + pageSize) < this.statusesTotalCount) {
      size = from + pageSize;
    }
    else {
      size = this.orgTotalCount;
    }

    if (this.activeFilters.length !== 0) {
      this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, from, size);
    }
    else if (this.searchText.length !== 0) {
      this.getSearchResults(from, size);
    }
    else {
      this.getAllStatuses((pageIndex).toString(), pageSize.toString(), event.active, event.direction);
    }

  }

  // tslint:disable-next-line:typedef
  filterPredicate(data: any, filterValue: any): boolean {
    const filters = filterValue.split('|');
    if (filters[1] === 'Metadata submitted to BioSamples') {
      return data.biosampleStatus === filters[0].split(' - ')[1];
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
        if (key === 'organism') {
          dataToReturn[key] = data.organism.text;
        }
      } else {
        dataToReturn[key] = data[key];
      }
    }
    return dataToReturn;
  }

  // tslint:disable-next-line:typedef
  checkFilterIsActive(filter: string) {
    if (this.activeFilters.indexOf(filter) !== -1) {
      return 'active';
    }

  }

  // tslint:disable-next-line:typedef
  onFilterClick(event, label: string, filter: string) {
    let inactiveClassName = label.toLowerCase().replace(" ", "-") + '-inactive';
    const filterIndex = this.activeFilters.indexOf(filter);
    if (filterIndex !== -1) {
      $('.' + inactiveClassName).removeClass('non-disp');
      this.removeFilter(filter);
    } else {
      $('.' + inactiveClassName).addClass('non-disp');
      $(event.target).removeClass('non-disp');
      $(event.target).addClass('disp');

      this.selectedFilterArray(label, filter);
      this.activeFilters.push(filter);
      this.dataSource.filter = `${filter.trim().toLowerCase()}|${label}`;
      this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 20);
      this.updateActiveRouteParams();
    }

  }

  selectedFilterArray(key: string, value: string) {
    let jsonObj: {};
    if (key.toLowerCase() == 'biosamples') {
      jsonObj = { "name": "biosamples", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == "raw-data") {
      jsonObj = { "name": "raw_data", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == "mapped-reads") {
      jsonObj = { "name": "mapped_reads", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == "assemblies") {
      jsonObj = { "name": "assemblies", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == "annotation-complete") {
      jsonObj = { "name": "annotation_complete", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == "annotation") {
      jsonObj = { "name": "annotation", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    }

  }

  updateActiveRouteParams() {
    const params = {};
    const paramArray = this.urlAppendFilterArray.map(x => Object.assign({}, x));
    if (paramArray.length != 0) {
      for (let i = 0; i < paramArray.length; i++) {
        params[paramArray[i].name] = paramArray[i].value;
      }
      this.router.navigate(['tracking_system'], { queryParams: params });
    }
  }

  // tslint:disable-next-line:typedef
  removeAllFilters() {
    $('.biosamples-inactive').removeClass('non-disp');
    $('.raw-data-inactive').removeClass('non-disp');
    $('.mapped-reads-inactive').removeClass('non-disp');
    $('.assemblies-inactive').removeClass('non-disp');
    $('.annotation-complete-inactive').removeClass('non-disp');
    $('.annotation-inactive').removeClass('non-disp');

    this.activeFilters = [];
    this.urlAppendFilterArray = [];
    this.dataSource.filter = undefined;
    this.getAllStatuses(0, 20, this.sort.active, this.sort.direction);
    this.router.navigate(['tracking_system'], {});
  }

  // tslint:disable-next-line:typedef
  removeFilter(filter: string) {
    if (filter != undefined) {
      this.updateDomForRemovedFilter(filter);
      this.updateActiveRouteParams();
      const filterIndex = this.activeFilters.indexOf(filter);
      this.activeFilters.splice(filterIndex, 1);
      if (this.activeFilters.length !== 0) {
        this.dataSource.filter = this.activeFilters[0].trim().toLowerCase();
        this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 20);
      } else {
        this.router.navigate(['tracking_system'], {});
        this.dataSource.filter = undefined;
        this.getAllStatuses(0, 20, this.sort.active, this.sort.direction);
      }
    }
  }

  updateDomForRemovedFilter(filter: string) {
    if (this.urlAppendFilterArray.length != 0) {
      let inactiveClassName: string;
      this.urlAppendFilterArray.filter(obj => {
        if (obj.value == filter) {
          inactiveClassName = obj.name + '-inactive';
          $('.' + inactiveClassName).removeClass('non-disp');
          $('.' + inactiveClassName).removeClass('active');
          $('.' + inactiveClassName).addClass('disp');

          const filterIndex = this.urlAppendFilterArray.indexOf(obj);
          this.urlAppendFilterArray.splice(filterIndex, 1);
        }
      });
    }
  }

  // tslint:disable-next-line:typedef
  getFilters() {
    this.statusesService.getStatusesFilters().subscribe(
      data => {
        this.filtersMap = data;
        this.BiosamplesFilters = this.filtersMap.biosamples.filter(i => i !== "");
        this.RawDataFilters = this.filtersMap.raw_data.filter(i => i !== "");
        this.MappedReadsFilters = this.filtersMap.mapped_reads.filter(i => i !== "");
        this.AssembliesFilters = this.filtersMap.assemblies.filter(i => i !== "");
        this.AnnotationCompleteFilters = this.filtersMap.annotation_complete.filter(i => i !== "");
        this.AnnotationFilters = this.filtersMap.annotation.filter(i => i !== "");
      },
      err => console.log(err)
    );


  }

  getStatusClass(status: string) {
    if (status.toLowerCase().includes('waiting')) {
      return 'badge badge-pill badge-warning';
    } else {
      return 'badge badge-pill badge-success';
    }
  }

  getFilterResults(filter, sortColumn?, sortOrder?, from?, size?) {
    this.spinner.show();
    this.statusesService.getFilterResults(filter, this.sort.active, this.sort.direction, from, size)
      .subscribe(
        data => {
          const unpackedData = [];
          for (const item of data.hits.hits) {
            unpackedData.push(this.unpackData(item));
          }
          this.statusesTotalCount = data.hits.total.value;
          this.dataSource = new MatTableDataSource<any>(unpackedData);
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = this.filterPredicate;
          this.unpackedData = unpackedData;
          this.spinner.hide();
        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      )
  }

  // tslint:disable-next-line:typedef
  getSearchResults(from?, size?) {
    $('.sex-inactive').removeClass('non-disp');
    $('.organism-part-inactive').removeClass('non-disp');
    $('.tracking-status-inactive').removeClass('non-disp');
    this.spinner.show();
    if (this.searchText.length == 0) {
      this.getAllStatuses(0, 20, this.sort.active, this.sort.direction);
    }
    else {
      this.statusesService.getSearchResults(this.searchText, this.sort.active, this.sort.direction, from, size)
        .subscribe(
          data => {
            const unpackedData = [];
            for (const item of data.hits.hits) {
              unpackedData.push(this.unpackData(item));
            }
            this.statusesTotalCount = data.hits.total.value;
            this.dataSource = new MatTableDataSource<any>(unpackedData);
            this.dataSource.sort = this.sort;
            this.dataSource.filterPredicate = this.filterPredicate;
            this.unpackedData = unpackedData;
            this.spinner.hide();
          },
          err => {
            console.log(err);
            this.spinner.hide();
          }
        )
    }
  }

  toggleCollapse(filterKey) {
    if (filterKey == 'Metadata submitted to BioSamples') {
      if (this.isBiosampleFilterCollapsed) {
        this.itemLimitBiosampleFilter = 10000;
        this.isBiosampleFilterCollapsed = false;
      } else {
        this.itemLimitBiosampleFilter = 3;
        this.isBiosampleFilterCollapsed = true;
      }
    }
    else if (filterKey == 'Data submitted to ENA') {
      if (this.isEnaFilterCollapsed) {
        this.itemLimitEnaFilter = 10000;
        this.isEnaFilterCollapsed = false;
      } else {
        this.itemLimitEnaFilter = 3;
        this.isEnaFilterCollapsed = true;
      }
    }
  }

  findBioSampleByOrganismName(name, from?, size?) {
    this.spinner.show();
    this.orgName = name;
    this.statusesService.findBioSampleByOrganismName(this.orgName, this.sort.active, this.sort.direction, from, size)
      .subscribe(
        data => {
          const unpackedData = [];
          for (const item of data.hits.hits) {
            unpackedData.push(this.unpackData(item));
          }
          this.orgTotalCount = data.hits.total.value;
          if (this.orgTotalCount == 1) {
            this.spinner.hide();
            this.router.navigate(['/data/details/' + data.hits.hits[0]._source.accession], {});
          }
          else {
            this.orgDataSource = new MatTableDataSource<any>(unpackedData);
            this.orgDataSource.sort = this.sort;
            this.showOrganismTable = true;
            this.spinner.hide();
            $("#org-table").show();
            $("#overlay").css({ "display": "block" });
            $(window).scrollTop(200);
          }
        },
        err => {
          this.spinner.hide();
          console.log(err);
        }
      )
  }

  toggleOrganismTable() {
    $("#org-table").hide();
    $("#overlay").css({ "display": "none" });
    this.showOrganismTable = false;
    this.orgDataSource = new MatTableDataSource<any>();
    this.orgDataSource.sort = this.sort;
  }

}
