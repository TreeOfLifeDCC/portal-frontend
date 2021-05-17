import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sample, samples } from '../../model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'dashboard-organism-details',
  templateUrl: './organism-details.component.html',
  styleUrls: ['./organism-details.component.css']
})
export class OrganismDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  bioSampleId: string;
  bioSampleObj;
  dataSourceRecords;
  specBioSampleTotalCount;
  specDisplayedColumns = ['accession', 'organism', 'commonName', 'sex', 'organismPart', 'trackingSystem'];


  isSexFilterCollapsed = true;
  isTrackCollapsed = true;
  isOrganismPartCollapsed = true;
  itemLimitSexFilter: number;
  itemLimitOrgFilter: number;
  itemLimitTrackFilter: number;
  filterSize: number;
  searchText = '';
  activeFilters = [];
  filtersMap;
  filters = {
    sex: {},
    trackingSystem: {},
    organismPart: {}
  };
  sexFilters = [];
  trackingSystemFilters = [];
  organismPartFilters = [];
  unpackedData;
  organismName;
  relatedRecords;
  filterJson = {
    sex: "",
    organismPart: "",
    trackingSystem: ""
  };

  dataSourceFiles;
  dataSourceFilesCount;
  dataSourceAssemblies;
  dataSourceAssembliesCount;
  dataSourceAnnotation;
  dataSourceAnnotationCount;

  displayedColumnsFiles = ['study_accession', 'experiment_accession', 'run_accession', 'fastq_ftp', 'submitted_ftp',
    'instrument_platform', 'instrument_model', 'library_layout', 'library_strategy', 'library_source',
    'library_selection'];
  displayedColumnsAssemblies = ['accession', 'assembly_name', 'description', 'version'];
  displayedColumnsAnnotation = ['accession', 'annotation', 'proteins', 'transcripts', 'softmasked_genome', 'other_data', 'view_in_browser'];
  
  @ViewChild('experimentsTable') exPaginator: MatPaginator;
  @ViewChild('assembliesTable') asPaginator: MatPaginator;
  @ViewChild('annotationTable') anPaginator: MatPaginator;

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private spinner: NgxSpinnerService, private router: Router) {
    this.route.params.subscribe(param => this.bioSampleId = param.id);
  }

  ngOnInit(): void {
    this.activeFilters = [];
    this.filterSize = 3;
    this.itemLimitSexFilter = this.filterSize;
    this.itemLimitOrgFilter = this.filterSize;
    this.itemLimitTrackFilter = this.filterSize;
    this.relatedRecords = [];
    this.filterJson['sex'] = '';
    this.filterJson['organismPart'] = '';
    this.filterJson['trackingSystem'] = '';
    this.getBiosampleByOrganism();
  }

  ngAfterViewInit(): void {
  }

  getBiosampleByOrganism() {
    this.dashboardService.getRootOrganismByOrganism(this.bioSampleId)
      .subscribe(
        data => {
          const unpackedData = [];
          this.bioSampleObj = data;
          for (const item of data.records) {
            unpackedData.push(this.unpackData(item));
          }
          if (unpackedData.length > 0) {
            this.getFilters(data.organism);
          }
          setTimeout(() => {
            this.organismName = data.organism;
            this.dataSourceRecords = new MatTableDataSource<any>(unpackedData);
            this.specBioSampleTotalCount = unpackedData?.length;
            this.dataSourceRecords.paginator = this.paginator;

            if (data.experiment != null) {
              this.dataSourceFiles = new MatTableDataSource<Sample>(data.experiment);
              this.dataSourceFilesCount = data.experiment?.length;
            }
            else {
              this.dataSourceFiles = new MatTableDataSource<Sample>();
              this.dataSourceFilesCount = 0;
            }
            if (data.assemblies != null) {
              this.dataSourceAssemblies = new MatTableDataSource<any>(data.assemblies);
              this.dataSourceAssembliesCount = data.assemblies?.length;
            }
            else {
              this.dataSourceAssemblies = new MatTableDataSource<Sample>();
              this.dataSourceAssembliesCount = 0;
            }
            if (data.annotation != null) {
              this.dataSourceAnnotation = new MatTableDataSource<any>(data.annotation);
              this.dataSourceAnnotationCount = data.annotation?.length;
            }
            else {
              this.dataSourceAnnotation = new MatTableDataSource<Sample>();
              this.dataSourceAnnotationCount = 0;
            }

            this.dataSourceFiles.paginator = this.exPaginator;
            this.dataSourceAssemblies.paginator = this.asPaginator;
            this.dataSourceAnnotation.paginator = this.anPaginator;

            this.dataSourceRecords.sort = this.sort;
            this.dataSourceFiles.sort = this.sort;
            this.dataSourceAssemblies.sort = this.sort;
            this.dataSourceAnnotation.sort = this.sort;
          }, 50)
        },
        err => console.log(err)
      );
  }

  filesSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFiles.filter = filterValue.trim().toLowerCase();
  }

  assembliesSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAssemblies.filter = filterValue.trim().toLowerCase();
  }

  annotationSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAnnotation.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRecords.filter = filterValue.trim().toLowerCase();
  }

  unpackData(data: any) {
    const dataToReturn = {};
    if (data.hasOwnProperty('_source')) {
      data = data._source;
    }
    for (const key of Object.keys(data)) {
      if (key === 'organism') {
        dataToReturn[key] = data.organism.text;
      }
      else {
        if (key === 'commonName' && data[key] == null) {
          dataToReturn[key] = "-"
        }
        else {
          dataToReturn[key] = data[key];
        }
      }
    }
    return dataToReturn;
  }

  checkFilterIsActive(filter: string) {
    if (this.activeFilters.indexOf(filter) !== -1) {
      return 'active';
    }

  }

  onFilterClick(event, label: string, filter: string) {
    this.searchText = '';
    let inactiveClassName = label.toLowerCase().replace(" ", "-") + '-inactive';
    this.createFilterJson(label.toLowerCase().replace(" ", ""), filter);
    const filterIndex = this.activeFilters.indexOf(filter);

    if (filterIndex !== -1) {
      $('.' + inactiveClassName).removeClass('non-disp');
      this.removeFilter(filter);
    } else {
      this.activeFilters.push(filter);
      this.dataSourceRecords.filter = this.filterJson;
      this.getFiltersForSelectedFilter(this.dataSourceRecords.filteredData);
      $('.' + inactiveClassName).addClass('non-disp');
      $(event.target).removeClass('non-disp');
      $(event.target).addClass('disp');
      $(event.target).addClass('active');
    }
  }

  createFilterJson(key, value) {
    if (key === 'sex') {
      this.filterJson['sex'] = value;
    }
    else if (key === 'organismpart') {
      this.filterJson['organismPart'] = value;
    }
    else if (key === 'trackingstatus') {
      this.filterJson['trackingSystem'] = value;
    }
    this.dataSourceRecords.filterPredicate = ((data, filter) => {
      const a = !filter.sex || data.sex === filter.sex;
      const b = !filter.organismPart || data.organismPart === filter.organismPart;
      const c = !filter.trackingSystem || data.trackingSystem === filter.trackingSystem;
      return a && b && c;
    }) as (PeriodicElement, string) => boolean;
  }

  getFiltersForSelectedFilter(data: any) {
    const filters = {
      sex: {},
      trackingSystem: {},
      organismPart: {}
    };
    this.sexFilters = [];
    this.trackingSystemFilters = [];
    this.organismPartFilters = [];

    this.filters = filters;
    for (const item of data) {
      if (item.sex != null) {
        if (item.sex in filters.sex) {
          filters.sex[item.sex] += 1;
        } else {
          filters.sex[item.sex] = 1;
        }
      }
      if (item.trackingSystem != null) {
        if (item.trackingSystem in filters.trackingSystem) {
          filters.trackingSystem[item.trackingSystem] += 1;
        } else {
          filters.trackingSystem[item.trackingSystem] = 1;
        }
      }

      if (item.organismPart != null) {
        if (item.organismPart in filters.organismPart) {
          filters.organismPart[item.organismPart] += 1;
        } else {
          filters.organismPart[item.organismPart] = 1;
        }
      }
    }
    this.filters = filters;
    const sexFilterObj = Object.entries(this.filters.sex);
    const trackFilterObj = Object.entries(this.filters.trackingSystem);
    const orgFilterObj = Object.entries(this.filters.organismPart);
    let j = 0;
    for (let i = 0; i < sexFilterObj.length; i++) {
      let jsonObj = { "key": sexFilterObj[i][j], doc_count: sexFilterObj[i][j + 1] };
      this.sexFilters.push(jsonObj);
    }
    for (let i = 0; i < trackFilterObj.length; i++) {
      let jsonObj = { "key": trackFilterObj[i][j], doc_count: trackFilterObj[i][j + 1] };
      this.trackingSystemFilters.push(jsonObj);
    }
    for (let i = 0; i < orgFilterObj.length; i++) {
      let jsonObj = { "key": orgFilterObj[i][j], doc_count: orgFilterObj[i][j + 1] };
      this.organismPartFilters.push(jsonObj);
    }
  }

  removeAllFilters() {
    $('.sex-inactive').removeClass('non-disp');
    $('.tracking-status-inactive').removeClass('non-disp');
    $('.org-part-inactive').removeClass('non-disp');
    this.activeFilters = [];
    this.filterJson['sex'] = '';
    this.filterJson['organismPart'] = '';
    this.filterJson['trackingSystem'] = '';
    this.dataSourceRecords.filter = this.filterJson;
    this.getBiosampleByOrganism();
  }

  removeFilter(filter: string) {
    if (filter != undefined) {
      const filterIndex = this.activeFilters.indexOf(filter);
      if (this.activeFilters.length !== 0) {
        this.spliceFilterArray(filter);
        this.activeFilters.splice(filterIndex, 1);
        this.dataSourceRecords.filter = this.filterJson;
        this.getFiltersForSelectedFilter(this.dataSourceRecords.filteredData);
      } else {
        this.filterJson['sex'] = '';
        this.filterJson['organismPart'] = '';
        this.filterJson['trackingSystem'] = '';
        this.dataSourceRecords.filter = this.filterJson;
        this.getBiosampleByOrganism();
      }
    }
  }

  spliceFilterArray(filter: string) {
    if (this.filterJson['sex'] === filter) {
      this.filterJson['sex'] = '';
    }
    else if (this.filterJson['organismPart'] === filter) {
      this.filterJson['organismPart'] = '';
    }
    else if (this.filterJson['trackingSystem'] === filter) {
      this.filterJson['trackingSystem'] = '';
    }
  }

  // tslint:disable-next-line:typedef
  getFilters(organism) {
    this.dashboardService.getDetailTableOrganismFilters(organism).subscribe(
      data => {
        this.filtersMap = data;
        this.sexFilters = this.filtersMap.sex.filter(i => i !== "");
        this.trackingSystemFilters = this.filtersMap.trackingSystem.filter(i => i !== "");
        this.organismPartFilters = this.filtersMap.organismPart.filter(i => i !== "");
      },
      err => console.log(err)
    );


  }

  getStatusClass(status: string) {
    if (status === 'Annotation Complete') {
      return 'badge badge-pill badge-success';
    } else {
      return 'badge badge-pill badge-warning'
    }
  }

  getSearchResults(from?, size?) {
    $('.sex-inactive').removeClass('non-disp active');
    $('.tracking-status-inactive').removeClass('non-disp active');
    $('.org-part-inactive').removeClass('non-disp active');
    if (this.searchText.length == 0) {
      this.getBiosampleByOrganism();
    }
    else {
      this.activeFilters = [];
      this.dataSourceRecords.filter = this.searchText.trim();
      this.dataSourceRecords.filterPredicate = ((data, filter) => {
        const a = !filter || data.sex.toLowerCase().includes(filter.toLowerCase());
        const b = !filter || data.organismPart.toLowerCase().includes(filter.toLowerCase());
        const c = !filter || data.trackingSystem.toLowerCase().includes(filter.toLowerCase());
        const d = !filter || data.accession.toLowerCase().includes(filter.toLowerCase());
        const e = !filter || data.commonName.toLowerCase().includes(filter.toLowerCase());
        return a || b || c || d || e;
      }) as (PeriodicElement, string) => boolean;
      this.getFiltersForSelectedFilter(this.dataSourceRecords.filteredData);
    }
  }

  toggleCollapse(filterKey) {
    if (filterKey == 'Sex') {
      if (this.isSexFilterCollapsed) {
        this.itemLimitSexFilter = 10000;
        this.isSexFilterCollapsed = false;
      } else {
        this.itemLimitSexFilter = 3;
        this.isSexFilterCollapsed = true;
      }
    }
    else if (filterKey == 'Tracking Status') {
      if (this.isTrackCollapsed) {
        this.itemLimitTrackFilter = 10000;
        this.isTrackCollapsed = false;
      } else {
        this.itemLimitTrackFilter = 3;
        this.isTrackCollapsed = true;
      }
    }
    else if (filterKey == 'Organism Part') {
      if (this.isOrganismPartCollapsed) {
        this.itemLimitOrgFilter = 10000;
        this.isOrganismPartCollapsed = false;
      } else {
        this.itemLimitOrgFilter = 3;
        this.isOrganismPartCollapsed = true;
      }
    }
  }

  redirectTo(accession: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/data/root/details/" + accession]));
  }

}
