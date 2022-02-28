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
  codes = {
    m: 'mammals',
    d: 'dicots',
    i: 'insects',
    u: 'algae',
    p: 'protists',
    x: 'molluscs',
    t: 'other-animal-phyla',
    q: 'arthropods',
    k: 'chordates',
    f: 'fish',
    a: 'amphibians',
    b: 'birds',
    e: 'echinoderms',
    w: 'annelids',
    j: 'jellyfish',
    h: 'platyhelminths',
    n: 'nematodes',
    v: 'vascular-plants',
    l: 'monocots',
    c: 'non-vascular-plants',
    g: 'fungi',
    o: 'sponges',
    r: 'reptiles',
    s: 'sharks',
    y: 'bacteria',
    z: 'archea'
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  bioSampleId: string;
  bioSampleObj;
  dataSourceRecords;
  bioSampleTotalCount;
  displayedColumns = ['accession', 'organism', 'commonName', 'sex', 'organismPart', 'trackingSystem'];


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
  dataSourceRelatedAnnotation;
  dataSourceRelatedAnnotationCount;

  experimentColumnsDefination = [{ column: "study_accession", selected: true }, { column: "secondary_study_accession", selected: false }, { column: "sample_accession", selected: true }, { column: "secondary_sample_accession", selected: false }, { column: "experiment_accession", selected: true }, { column: "run_accession", selected: true }, { column: "submission_accession", selected: false }, { column: "tax_id", selected: true }, { column: "scientific_name", selected: true }, { column: "instrument_platform", selected: false }, { column: "instrument_model", selected: false }, { column: "library_name", selected: false }, { column: "nominal_length", selected: false }, { column: "library_layout", selected: false }, { column: "library_strategy", selected: false }, { column: "library_source", selected: false }, { column: "library_selection", selected: false }, { column: "read_count", selected: false }, { column: "base_count", selected: false }, { column: "center_name", selected: false }, { column: "first_public", selected: false }, { column: "last_updated", selected: false }, { column: "experiment_title", selected: false }, { column: "study_title", selected: false }, { column: "study_alias", selected: false }, { column: "experiment_alias", selected: false }, { column: "run_alias", selected: false }, { column: "fastq_bytes", selected: false }, { column: "fastq_md5", selected: false }, { column: "fastq_ftp", selected: true }, { column: "fastq_aspera", selected: false }, { column: "fastq_galaxy", selected: false }, { column: "submitted_bytes", selected: false }, { column: "submitted_md5", selected: false }, { column: "submitted_ftp", selected: true }, { column: "submitted_aspera", selected: false }, { column: "submitted_galaxy", selected: false }, { column: "submitted_format", selected: false }, { column: "sra_bytes", selected: false }, { column: "sra_md5", selected: false }, { column: "sra_ftp", selected: true }, { column: "sra_aspera", selected: false }, { column: "sra_galaxy", selected: false }, { column: "cram_index_ftp", selected: false }, { column: "cram_index_aspera", selected: false }, { column: "cram_index_galaxy", selected: false }, { column: "sample_alias", selected: false }, { column: "broker_name", selected: false }, { column: "sample_title", selected: false }, { column: "nominal_sdev", selected: false }, { column: "first_created", selected: false }, { column: "library_construction_protocol", selected: true }]

  displayedColumnsFiles = [];
  displayedColumnsAnnotations = [];
  displayedColumnsAssemblies = ['accession', 'assembly_name', 'description', 'version'];
  displayedColumnsAnnotation = ['accession', 'annotation', 'proteins', 'transcripts', 'softmasked_genome', 'other_data', 'view_in_browser'];
  displayedColumnsRelatedAnnotation = [
    { name: "Study Accession", column: "study_accession", selected: true },
    { name: "Sample Accession", column: "sample_accession", selected: true },
    { name: "Secondary Sample Accession", column: "secondary_sample_accession", selected: true },
    { name: "Tax Id", column: "tax_id", selected: true },
    { name: "Study Alias", column: "study_alias", selected: true },
    { name: "Submitted files: FTP", column: "submitted_ftp", selected: true },
    { name: "Submitted files: Aspera", column: "submitted_aspera", selected: true },
    { name: "Broker Name", column: "broker_name", selected: true },
    { name: "Analysis Accession", column: "analysis_accession", selected: false },
    { name: "Anaylsis Type", column: "analysis_type", selected: false },
    { name: "Center Name", column: "center_name", selected: false },
    { name: "Generated Bytes", column: "generated_bytes", selected: false },
    { name: "Generated MD5", column: "generated_md5", selected: false },
    { name: "Sample Alias", column: "sample_alias", selected: false },
    { name: "Submitted Bytes", column: "submitted_bytes", selected: false },
    { name: "Submitted MD5", column: "submitted_md5", selected: false },
    { name: "Anaylsis Alias", column: "analysis_alias", selected: false },
    { name: "Assembly Type", column: "assembly_type", selected: false },
    { name: "First Public", column: "first_public", selected: false },
    { name: "Generated FTP", column: "generated_ftp", selected: false },
    { name: "Last Updated", column: "last_updated", selected: false },
    { name: "Sample Title", column: "sample_title", selected: false },
    { name: "Study Title", column: "study_title", selected: false },
    { name: "Analysis Title", column: "analysis_title", selected: false },
    { name: "Generated Aspera", column: "generated_aspera", selected: false },
    { name: "Generated Galaxy", column: "generated_galaxy", selected: false }
  ]

  genomeNotes = [];
  INSDC_ID = null;
  dataSourceGoatInfo;
  displayedColumnsGoatInfo = ['name', 'value', 'count', 'aggregation_method', 'aggregation_source'];

  @ViewChild('experimentsTable') exPaginator: MatPaginator;
  @ViewChild('assembliesTable') asPaginator: MatPaginator;
  @ViewChild('annotationTable') anPaginator: MatPaginator;
  @ViewChild('relatedOrganisms') relatedOrganismsTable: MatPaginator;
  @ViewChild('relatedAnnotationTable') relatedAnnotationTable: MatPaginator;

  //Related Specimens
  @ViewChild(MatPaginator) specPaginator: MatPaginator;
  @ViewChild(MatSort) specSort: MatSort;
  dataSourceSpecRecords;
  specBioSampleTotalCount;
  specDisplayedColumns = ['accession', 'organism', 'commonName', 'sex', 'organismPart'];


  isSpecSexFilterCollapsed = true;
  isSpecOrganismPartCollapsed = true;
  specitemLimitSexFilter: number;
  specitemLimitOrgFilter: number;
  specfilterSize: number;
  specSearchText = '';
  specActiveFilters = [];
  specFiltersMap;
  specFilters = {
    sex: {},
    organismPart: {}
  };
  specSexFilters = [];
  specOrganismPartFilters = [];
  specUnpackedData;
  specFilterJson = {
    sex: "",
    organismPart: "",
  };

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private spinner: NgxSpinnerService, private router: Router) {
    this.route.params.subscribe(param => this.bioSampleId = param.id);
  }

  ngOnInit(): void {
    this.dataSourceGoatInfo = {};
    this.activeFilters = [];
    this.filterSize = 3;
    this.itemLimitSexFilter = this.filterSize;
    this.itemLimitOrgFilter = this.filterSize;
    this.itemLimitTrackFilter = this.filterSize;
    this.relatedRecords = [];
    this.filterJson['sex'] = '';
    this.filterJson['organismPart'] = '';
    this.filterJson['trackingSystem'] = '';

    this.specActiveFilters = [];
    this.specfilterSize = 3;
    this.specitemLimitSexFilter = this.specfilterSize;
    this.specitemLimitOrgFilter = this.specfilterSize;
    this.specFilterJson['sex'] = '';
    this.specFilterJson['organismPart'] = '';

    this.getDisplayedColumns();
    this.getAnnotationDisplayedColumns();
    this.getBiosampleById();

  }

  getAnnotationDisplayedColumns() {
    this.displayedColumnsAnnotations = [];
    this.displayedColumnsRelatedAnnotation.forEach(obj => {
      if (obj.selected) {
        this.displayedColumnsAnnotations.push(obj.column)
      }
    });
  }

  getDisplayedColumns() {
    this.displayedColumnsFiles = [];
    this.experimentColumnsDefination.forEach(obj => {
      if (obj.selected) {
        this.displayedColumnsFiles.push(obj.column)
      }
    });
  }

  expanded() {
  }

  showSelectedColumn(selectedColumn, checked) {
    let index = this.experimentColumnsDefination.indexOf(selectedColumn);
    let item = this.experimentColumnsDefination[index];
    item.selected = checked;
    this.experimentColumnsDefination[index] = item;
    this.getDisplayedColumns();
    this.getBiosampleById();
  }

  showSelectedAnnotationsColumn(selectedColumn, checked) {
    let index = this.displayedColumnsRelatedAnnotation.indexOf(selectedColumn);
    let item = this.displayedColumnsRelatedAnnotation[index];
    item.selected = checked;
    this.displayedColumnsRelatedAnnotation[index] = item;
    this.getAnnotationDisplayedColumns();
    this.getBiosampleById();
  }

  ngAfterViewInit(): void {
  }

  getBiosampleById() {
    this.dashboardService.getRootOrganismById(this.bioSampleId)
      .subscribe(
        data => {
          const unpackedData = [];
          this.bioSampleObj = data;
          this.dataSourceGoatInfo = data.goat_info.attributes;
          if(data.experiment?.length > 0) {
            this.INSDC_ID = data.experiment[0].study_accession;
          }
          for (const item of data.records) {
            unpackedData.push(this.unpackData(item));
          }
          if (unpackedData.length > 0) {
            this.getFilters(data.organism);
          }
          setTimeout(() => {
            this.organismName = data.organism;
            this.dataSourceRecords = new MatTableDataSource<any>(unpackedData);
            this.bioSampleTotalCount = unpackedData?.length;
            this.genomeNotes = data.genome_notes
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

            if (data.related_annotation != null) {
              this.dataSourceRelatedAnnotation = new MatTableDataSource<any>(data.related_annotation);
              this.dataSourceRelatedAnnotation = data.related_annotation?.length;
            }
            else {
              this.dataSourceRelatedAnnotation = new MatTableDataSource<Sample>();
              this.dataSourceRelatedAnnotationCount = 0;
            }

            this.dataSourceFiles.paginator = this.exPaginator;
            this.dataSourceAssemblies.paginator = this.asPaginator;
            this.dataSourceAnnotation.paginator = this.anPaginator;
            this.dataSourceRecords.paginator = this.relatedOrganismsTable;
            this.dataSourceRelatedAnnotation.paginator = this.relatedAnnotationTable;

            this.dataSourceRecords.sort = this.sort;
            this.dataSourceFiles.sort = this.sort;
            this.dataSourceAssemblies.sort = this.sort;
            this.dataSourceAnnotation.sort = this.sort;
            this.dataSourceRelatedAnnotation.sort = this.sort;
          }, 50)

          if (this.bioSampleObj.specimens.length > 0) {
            this.bioSampleObj.specimens.filter(obj => {
              if (obj.commonName == null) {
                obj.commonName = "-";
              }
            });
            this.getSpecFiltersForSelectedFilter(this.bioSampleObj.specimens);
          }

          setTimeout(() => {
            this.dataSourceSpecRecords = new MatTableDataSource<any>(this.bioSampleObj.specimens);
            this.specBioSampleTotalCount = this.bioSampleObj.specimens?.length;
            this.dataSourceSpecRecords.paginator = this.paginator;
            this.dataSourceSpecRecords.sort = this.sort;
          }, 50);
        },
        err => console.log(err)
      );
  }

  // Related Specimens
  checkSpecFilterIsActive(filter: string) {
    if (this.specActiveFilters.indexOf(filter) !== -1) {
      return 'active';
    }

  }

  onSpecFilterClick(event, label: string, filter: string) {
    this.specSearchText = '';
    let inactiveClassName = 'spec-'+label.toLowerCase().replace(" ", "-") + '-inactive';
    this.createspecFilterJson(label.toLowerCase().replace(" ", ""), filter);
    const filterIndex = this.specActiveFilters.indexOf(filter);

    if (filterIndex !== -1) {
      $('.' + inactiveClassName).removeClass('non-disp');
      this.removeSpecFilter(filter);
    } else {
      this.specActiveFilters.push(filter);
      this.dataSourceSpecRecords.filter = this.specFilterJson;
      this.getSpecFiltersForSelectedFilter(this.dataSourceSpecRecords.filteredData);
      $('.' + inactiveClassName).addClass('non-disp');
      $(event.target).removeClass('non-disp');
      $(event.target).addClass('disp');
      $(event.target).addClass('active');
    }
  }

  createspecFilterJson(key, value) {
    if (key === 'sex') {
      this.specFilterJson['sex'] = value;
    }
    else if (key === 'organismpart') {
      this.specFilterJson['organismPart'] = value;
    }
    this.dataSourceSpecRecords.filterPredicate = ((data, filter) => {
      const a = !filter.sex || data.sex === filter.sex;
      const b = !filter.organismPart || data.organismPart === filter.organismPart;
      return a && b;
    }) as (PeriodicElement, string) => boolean;
  }

  getSpecFiltersForSelectedFilter(data: any) {
    const filters = {
      sex: {},
      organismPart: {}
    };
    this.specSexFilters = [];
    this.specOrganismPartFilters = [];

    this.specFilters = filters;
    for (const item of data) {
      if (item.sex in filters.sex) {
        filters.sex[item.sex] += 1;
      } else {
        filters.sex[item.sex] = 1;
      }
      if (item.organismPart in filters.organismPart) {
        filters.organismPart[item.organismPart] += 1;
      } else {
        filters.organismPart[item.organismPart] = 1;
      }
    }
    this.specFilters = filters;
    const sexFilterObj = Object.entries(this.specFilters.sex);
    const orgFilterObj = Object.entries(this.specFilters.organismPart);
    let j = 0;
    for (let i = 0; i < sexFilterObj.length; i++) {
      let jsonObj = { "key": sexFilterObj[i][j], doc_count: sexFilterObj[i][j + 1] };
      this.specSexFilters.push(jsonObj);
    }
    for (let i = 0; i < orgFilterObj.length; i++) {
      let jsonObj = { "key": orgFilterObj[i][j], doc_count: orgFilterObj[i][j + 1] };
      this.specOrganismPartFilters.push(jsonObj);
    }
  }

  removeAllSpecFilters() {
    $('.spec-sex-inactive').removeClass('non-disp');
    $('.spec-org-part-inactive').removeClass('non-disp');
    this.specActiveFilters = [];
    this.specFilterJson['sex'] = '';
    this.specFilterJson['organismPart'] = '';
    this.dataSourceSpecRecords.filter = this.specFilterJson;
    this.getBiosampleById();
  }

  removeSpecFilter(filter: string) {
    if (filter != undefined) {
      const filterIndex = this.specActiveFilters.indexOf(filter);
      if (this.specActiveFilters.length !== 0) {
        this.spliceSpecFilterArray(filter);
        this.specActiveFilters.splice(filterIndex, 1);
        this.dataSourceSpecRecords.filter = this.specFilterJson;
        this.getSpecFiltersForSelectedFilter(this.dataSourceSpecRecords.filteredData);
      } else {
        this.specFilterJson['sex'] = '';
        this.specFilterJson['organismPart'] = '';
        this.dataSourceSpecRecords.filter = this.specFilterJson;
        this.getBiosampleById();
      }
    }
  }

  spliceSpecFilterArray(filter: string) {
    if (this.specFilterJson['sex'] === filter) {
      this.specFilterJson['sex'] = '';
    }
    else if (this.specFilterJson['organismPart'] === filter) {
      this.specFilterJson['organismPart'] = '';
    }
  }

  getSpecFilters(accession) {
    this.dashboardService.getSpecimenFilters(accession).subscribe(
      data => {
        this.specFiltersMap = data;
        this.specSexFilters = this.specFiltersMap.sex.filter(i => i !== "");
        this.specOrganismPartFilters = this.specFiltersMap.organismPart.filter(i => i !== "");
      },
      err => console.log(err)
    );


  }


  getSpecSearchResults(from?, size?) {
    $('.spec-sex-inactive').removeClass('non-disp active');
    $('.spec-org-part-inactive').removeClass('non-disp active');
    if (this.specSearchText.length == 0) {
      this.getBiosampleById()
    }
    else {
      this.specActiveFilters = [];
      this.dataSourceSpecRecords.filter = this.specSearchText.trim();
      this.dataSourceSpecRecords.filterPredicate = ((data, filter) => {
        const a = !filter || data.sex.toLowerCase().includes(filter.toLowerCase());
        const b = !filter || data.organismPart.toLowerCase().includes(filter.toLowerCase());
        const c = !filter || data.accession.toLowerCase().includes(filter.toLowerCase());
        const d = !filter || data.commonName.toLowerCase().includes(filter.toLowerCase());
        return a || b || c || d;
      }) as (PeriodicElement, string) => boolean;
      this.getSpecFiltersForSelectedFilter(this.dataSourceSpecRecords.filteredData);
    }
  }

  specToggleCollapse(filterKey) {
    if (filterKey == 'Sex') {
      if (this.isSpecSexFilterCollapsed) {
        this.specitemLimitSexFilter = 10000;
        this.isSpecSexFilterCollapsed = false;
      } else {
        this.specitemLimitSexFilter = 3;
        this.isSpecSexFilterCollapsed = true;
      }
    }
    else if (filterKey == 'Organism Part') {
      if (this.isSpecOrganismPartCollapsed) {
        this.specitemLimitOrgFilter = 10000;
        this.isSpecOrganismPartCollapsed = false;
      } else {
        this.specitemLimitOrgFilter = 3;
        this.isSpecOrganismPartCollapsed = true;
      }
    }
  }

  specRedirectTo(accession: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/data/root/details/" + accession]));
  }
  // Related Specimens

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

  relatedAnnotationSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRelatedAnnotation.filter = filterValue.trim().toLowerCase();
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
    this.getBiosampleById();
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
        this.getBiosampleById();
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
      this.getBiosampleById();
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

  checkTolidExists(data) {
    return data != undefined && data.tolid != undefined && data.tolid != null;
  }

  generateTolidLink(data) {
    const organismName = data.organism.split(' ').join('_');
    const clade = this.codes[data.tolid.charAt(0)];
    return `https://tolqc.cog.sanger.ac.uk/darwin/${clade}/${organismName}`;
  }

  checkGenomeExists(data) {
    return data.genome_notes != null;
  }

  getGenomeURL(data) {
    const genomeNotes = data.genome_notes;
    let genomeNotesURL = '#';
    if (genomeNotes != null) {
      genomeNotesURL = genomeNotes[0].url;
    }
      return genomeNotesURL;
  }

}
