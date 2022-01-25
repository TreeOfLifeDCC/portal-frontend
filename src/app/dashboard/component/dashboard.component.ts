import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Title} from '@angular/platform-browser';
import {Sample} from '../model/dashboard.model';
import {DashboardService} from '../services/dashboard.service';
import {NgxSpinnerService} from 'ngx-spinner';

import {Taxonomy} from 'src/app/taxanomy/taxonomy.model';
import {TaxanomyService} from 'src/app/taxanomy/taxanomy.service';

import 'jquery';
import 'bootstrap';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
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
  bioSamples: Sample[];
  loading = true;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ulpam = [];
  isSexFilterCollapsed = true;
  isTrackCollapsed = true;
  filterKeyName = '';
  itemLimitSexFilter: number;
  itemLimitOrgFilter: number;
  itemLimitTrackFilter: number;
  filterSize: number;
  urlAppendFilterArray = [];
  searchText = '';


  activeFilters = [];
  filtersMap;
  filters = {
    sex: {},
    trackingSystem: {}
  };
  sexFilters = [];
  trackingSystemFilters = [];
  bioSampleTotalCount = 0;
  unpackedData;

  childTaxanomy: Taxonomy;
  selectedTaxonomy: any;
  isSingleClick: Boolean = true;
  currentTaxonomyTree: any;
  showElement: Boolean = true;
  taxonomies = [];
  currentTaxonomy: any;
  modalTaxa = '';
  isFilterSelected: Boolean;
  isDoubleClick: Boolean;
  selectedFilterValue;
  currentTaxaOnExpand;
  modalTaxa1 = '';
  BiosamplesFilters = [];
  RawDataFilters = [];
  MappedReadsFilters = [];
  AssembliesFilters = [];
  AnnotationFilters = [];
  AnnotationCompleteFilters = [];

  isBiosampleFilterCollapsed = true;
  isEnaFilterCollapsed = true;
  itemLimitBiosampleFilter: number;
  itemLimitEnaFilter: number;

  dataColumnsDefination = [{name: 'Organism', column: 'organism', selected: true}, {name: 'ToL ID', column: 'tolid', selected: true}, {name: 'INSDC ID', column: 'INSDC_ID', selected: true}, {name: 'Common Name', column: 'commonName', selected: true}, {name: 'Current Status', column: 'currentStatus', selected: true}, {name: 'External references', column: 'goatInfo', selected: true}, {name: 'Submitted to Biosamples', column: 'biosamples', selected: false}, {name: 'Raw data submitted to ENA', column: 'raw_data', selected: false}, {name: 'Mapped reads submitted to ENA', column: 'mapped_reads', selected: false}, {name: 'Assemblies submitted to ENA', column: 'assemblies', selected: false}, {name: 'Annotation complete', column: 'annotation_complete', selected: false}, {name: 'Annotation submitted to ENA', column: 'annotation', selected: false}];
  displayedColumns = [];
  constructor(private titleService: Title, private dashboardService: DashboardService,
              private activatedRoute: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService, private taxanomyService: TaxanomyService) { }

  ngOnInit(): void {
    this.getDisplayedColumns();
    this.getTaxonomyFilterQueryParamonInit();
    this.activeFilters = [];
    this.urlAppendFilterArray = [];
    this.filterSize = 4;
    this.itemLimitBiosampleFilter = this.filterSize;
    this.itemLimitEnaFilter = this.filterSize;
    this.titleService.setTitle('Data portal');
    this.getOrganismsQueryParamonInit();
    this.selectedTaxonomy = [];
    this.isFilterSelected = false;
    this.selectedFilterValue = '';
    this.currentTaxaOnExpand = '';
    this.resetTaxaTree();
    $('[data-toggle="tooltip"]').tooltip();
    this.currentTaxonomyTree = this.ulpam;
    // this.getTaxonomyFilterQueryParamonInit();
    this.isDoubleClick = this.currentTaxonomyTree === undefined ? false : true ;
    this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
  }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.ulpam);
    this.urlAppendFilterArray.push('taxonomyFilter', this.ulpam);
    console.log( this.urlAppendFilterArray.length);
    this.updateActiveRouteParams();
  }

  getDisplayedColumns() {
    this.displayedColumns = [];
    this.dataColumnsDefination.forEach(obj => {
      if (obj.selected) {
        this.displayedColumns.push(obj.column);
      }
    });
  }

  expanded() {
  }

  showSelectedColumn(selectedColumn, checked) {
    const index = this.dataColumnsDefination.indexOf(selectedColumn);
    const item = this.dataColumnsDefination[index];
    item.selected = checked;
    this.dataColumnsDefination[index] = item;
    this.getDisplayedColumns();
    this.getActiveFiltersAndResult();
  }

  getOrganismsQueryParamonInit() {
    const queryParamMap = this.activatedRoute.snapshot['queryParamMap'];
    const params = queryParamMap['params'];
    if (Object.keys(params).length != 0) {
      for (let key in params) {
        if (key != 'taxonomyFilter'){
          this.appendActiveFilters(key, params);
        }
      }
      setTimeout(() => {
        this.getActiveFiltersAndResult();
      }, 50);
    }
    else {
      this.getAllBiosamples(0, 15, this.sort.active, this.sort.direction);
    }
  }
  getTaxonomyFilterQueryParamonInit() {
    const queryParamMap = this.activatedRoute.snapshot['queryParamMap'];
    const params = queryParamMap['params'];
    if (Object.keys(params).length != 0) {
      for (let key in params) {
        // tslint:disable-next-line:triple-equals
        if (key == 'taxonomyFilter') {
          this.ulpam = JSON.parse(decodeURIComponent(queryParamMap.get(key)));
          console.log(this.ulpam);
        }


      }
      this.modalTaxa1 = this.modalTaxa;
    }
  }
  appendActiveFilters(key, params) {
    setTimeout(() => {
      this.urlAppendFilterArray.push({ name: key, value: params[key] });
      this.activeFilters.push(params[key]);
    }, 10);
  }

  getActiveFiltersAndResult(taxa?) {
    let taxonomy;
    if (taxa) {
      taxonomy = [taxa];
    }
    else {
      taxonomy = [this.currentTaxonomyTree];
    }
    if (this.currentTaxonomyTree != undefined) {
      const taxa1 = encodeURIComponent(JSON.stringify(taxonomy[0]));
      this.urlAppendFilterArray.push({name: 'taxonomyFilter', value: taxa1});
      this.updateActiveRouteParams();
    }
    this.dashboardService.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, taxonomy)
        .subscribe(
            data => {
              const unpackedData = [];
              for (const item of data.hits.hits) {
                unpackedData.push(this.unpackData(item));
              }
              this.bioSampleTotalCount = data.hits.total.value;
              this.dataSource = new MatTableDataSource<any>(unpackedData);
              this.dataSource.sort = this.sort;
              this.dataSource.filterPredicate = this.filterPredicate;
              this.unpackedData = unpackedData;
              this.filtersMap = data;
              this.parseFilterAggregation(data);
              this.childTaxanomy.superkingdom = [{ parent: 'Eukaryota', rank: 'kingdom', expanded: false, childData: data.aggregations.kingdomRank.scientificName.buckets }];
              for (let i = 0; i < this.urlAppendFilterArray.length; i++) {
                setTimeout(() => {
                  const inactiveClassName = '.' + this.urlAppendFilterArray[i].name + '-inactive';
                  const element = 'li:contains(\'' + this.urlAppendFilterArray[i].value + '\')';
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
        );
  }

  // tslint:disable-next-line:typedef
  getAllBiosamples(offset, limit, sortColumn?, sortOrder?) {
    this.spinner.show();
    this.getFilters();
    this.dashboardService.getAllBiosample(offset, limit, sortColumn, sortOrder)
        .subscribe(
            data => {
              const unpackedData = [];
              for (const item of data.rootSamples) {
                unpackedData.push(this.unpackData(item));
              }
              this.bioSampleTotalCount = data.count;
              this.dataSource = new MatTableDataSource<any>(unpackedData);
              this.dataSource.sort = this.sort;
              this.dataSource.filterPredicate = this.filterPredicate;
              this.unpackedData = unpackedData;
              setTimeout(() => {
                this.spinner.hide();
              }, 100);
            },
            err => {
              console.log(err);
              this.spinner.hide();
            }
        );
  }

  getNextBiosamples(currentSize, offset, limit, sortColumn?, sortOrder?) {
    this.spinner.show();
    this.dashboardService.getAllBiosample(offset, limit, sortColumn, sortOrder)
        .subscribe(
            data => {
              const unpackedData = [];
              for (const item of data.rootSamples) {
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
        );
  }

  pageChanged(event) {
    const taxonomy = [this.currentTaxonomyTree];
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    const previousSize = pageSize * pageIndex;

    const from = pageIndex * pageSize;
    const size = pageSize;

    if (this.activeFilters.length !== 0 || this.currentTaxonomyTree.length !== 0) {
      this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, from, size, taxonomy);
      setTimeout(() => {
        $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
      }, 250);
    }
    else if (this.searchText.length !== 0) {
      this.getSearchResults(from, size);
    }
    else {
      this.getNextBiosamples(previousSize, from, size, this.sort.active, this.sort.direction);
      setTimeout(() => {
        $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
      }, 250);
    }
  }

  customSort(event) {
    const taxonomy = [this.currentTaxonomyTree];
    this.paginator.pageIndex = 0;
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    const from = pageIndex * pageSize;
    let size = 0;
    if ((from + pageSize) < this.bioSampleTotalCount) {
      size = from + pageSize;
    }
    else {
      size = this.bioSampleTotalCount;
    }

    if (this.activeFilters.length !== 0 || this.currentTaxonomyTree.length !== 0) {
      this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, from, size, taxonomy);
      setTimeout(() => {
        $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
      }, 250);
    }
    else if (this.searchText.length !== 0) {
      this.getSearchResults(from, size);
    }
    else {
      this.getAllBiosamples((pageIndex).toString(), pageSize.toString(), event.active, event.direction);
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
    dataToReturn['id'] = data._id;
    if (data.hasOwnProperty('_source')) {
      data = data._source;
    }
    for (const key of Object.keys(data)) {
      if (key === 'experiment') {
        const exp = data[key];
        if (exp.length > 0) {
          dataToReturn['INSDC_ID'] = exp[0].study_accession;
        } else {
          dataToReturn['INSDC_ID'] = null;
        }

      }
      if (key === 'tax_id') {
        dataToReturn['goatInfo'] = 'https://goat.genomehubs.org/records?record_id=' + data[key] + '&result=taxon&taxonomy=ncbi#' + dataToReturn['organism'];
        dataToReturn[key] = data[key];
      }
      if (key === 'commonName' && data[key] == null) {
        dataToReturn[key] = '-';
      }
      else {
        dataToReturn[key] = data[key];
      }
    }
    return dataToReturn;
  }

  // tslint:disable-next-line:typedef
  checkFilterIsActive(filter: string) {
    if (this.activeFilters.indexOf(filter) !== -1) {
      return 'active-filter';
    }
    if (this.selectedTaxonomy.indexOf(filter) !== -1) {
      return 'active-filter';
    }

  }

  // tslint:disable-next-line:typedef
  onFilterClick(event, label: string, filter: string) {
    this.paginator.pageIndex = 0;
    const taxonomy = [this.currentTaxonomyTree];
    this.searchText = '';
    const inactiveClassName = label.toLowerCase().replace(' ', '-') + '-inactive';
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
      this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, taxonomy);
      this.updateActiveRouteParams();
      if (this.currentTaxonomyTree.length > 1) {
        setTimeout(() => {
          $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
        }, 250);
      }
    }

  }

  selectedFilterArray(key: string, value: string) {
    let jsonObj: {};
    if (key.toLowerCase() == 'biosamples') {
      jsonObj = { name: 'biosamples', value: value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == 'raw-data') {
      jsonObj = { name: 'raw_data', value: value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == 'mapped-reads') {
      jsonObj = { name: 'mapped_reads', value: value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == 'assemblies') {
      jsonObj = { name: 'assemblies', value: value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == 'annotation-complete') {
      jsonObj = { name: 'annotation_complete', value: value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == 'annotation') {
      jsonObj = { name: 'annotation', value: value };
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
      this.router.navigate(['data'], { queryParams: params });
    }
  }

  // tslint:disable-next-line:typedef
  removeAllFilters() {
    this.paginator.pageIndex = 0;
    this.isFilterSelected = false;
    $('#' + this.modalTaxa + '-kingdom').removeClass('active-filter');

    $('.biosamples-inactive').removeClass('non-disp');
    $('.raw-data-inactive').removeClass('non-disp');
    $('.mapped-reads-inactive').removeClass('non-disp');
    $('.assemblies-inactive').removeClass('non-disp');
    $('.annotation-complete-inactive').removeClass('non-disp');
    $('.annotation-inactive').removeClass('non-disp');

    this.resetTaxaTree();
    this.modalTaxa = '';
    this.activeFilters = [];
    this.urlAppendFilterArray = [];
    this.dataSource.filter = undefined;
    this.getFilters();
    this.getAllBiosamples(0, 15, this.sort.active, this.sort.direction);
    this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');

    this.router.navigate(['data'], {});
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 800);
  }

  // tslint:disable-next-line:typedef
  removeFilter(filter: string) {
    this.paginator.pageIndex = 0;
    if (filter != undefined) {
      this.updateDomForRemovedFilter(filter);
      this.updateActiveRouteParams();
      const filterIndex = this.activeFilters.indexOf(filter);
      this.activeFilters.splice(filterIndex, 1);
      if (this.activeFilters.length !== 0) {
        this.dataSource.filter = this.activeFilters[0].trim().toLowerCase();
        this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, [this.currentTaxonomyTree]);
        if (this.currentTaxonomyTree.length > 1) {
          setTimeout(() => {
            $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
          }, 250);
        }
      }
      else if (this.currentTaxonomyTree.length > 1) {
        if (this.activeFilters.length == 0) {
          this.urlAppendFilterArray = [];
          this.dataSource.filter = undefined;
          this.router.navigate(['data'], {});
        }
        this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, [this.currentTaxonomyTree]);
        setTimeout(() => {
          $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
        }, 250);
      }
      else {
        this.isFilterSelected = false;
        this.removeRankFromTaxaTree('superkingdom');
        this.dataSource.filter = undefined;
        this.activeFilters = [];
        this.ulpam = [];
        this.urlAppendFilterArray = [];
        this.dataSource.filter = undefined;
        this.getFilters();
        this.getAllBiosamples(0, 15, this.sort.active, this.sort.direction);
        this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
        this.modalTaxa = '';
        this.router.navigate(['data'], {});
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
    this.dashboardService.getOrganismFilters().subscribe(
        data => {
          this.filtersMap = data;
          this.BiosamplesFilters = this.filtersMap.biosamples.filter(i => i !== '');
          this.RawDataFilters = this.filtersMap.raw_data.filter(i => i !== '');
          this.MappedReadsFilters = this.filtersMap.mapped_reads.filter(i => i !== '');
          this.AssembliesFilters = this.filtersMap.assemblies.filter(i => i !== '');
          this.AnnotationCompleteFilters = this.filtersMap.annotation_complete.filter(i => i !== '');
          this.AnnotationFilters = this.filtersMap.annotation.filter(i => i !== '');
        },
        err => console.log(err)
    );


  }

  getStatusClass(status: string) {
    if (status === 'Annotation Complete') {
      return 'badge badge-pill badge-success';
    }
    else if (status == 'Done') {
      return 'badge badge-pill badge-success';
    }
    else if (status == 'Waiting') {
      return 'badge badge-pill badge-warning';
    }
    else {
      return 'badge badge-pill badge-warning';
    }
  }

  getFilterResults(filter, sortColumn?, sortOrder?, from?, size?, taxonomyFilter?) {
    this.spinner.show();
    this.dashboardService.getFilterResults(filter, this.sort.active, this.sort.direction, from, size, taxonomyFilter)
        .subscribe(
            data => {
              this.selectedTaxonomy = [];
              const unpackedData = [];
              for (const item of data.hits.hits) {
                unpackedData.push(this.unpackData(item));
              }
              this.bioSampleTotalCount = data.hits.total.value;
              this.dataSource = new MatTableDataSource<any>(unpackedData);
              this.dataSource.sort = this.sort;
              this.dataSource.filterPredicate = this.filterPredicate;
              this.unpackedData = unpackedData;
              this.filtersMap = data;
              this.parseFilterAggregation(data);
              this.childTaxanomy.superkingdom = [{ parent: 'Eukaryota', rank: 'kingdom', expanded: false, childData: data.aggregations.kingdomRank.scientificName.buckets }];
              this.spinner.hide();
              if (data.aggregations.childRank != undefined) {
                this.selectedTaxonomy.push(data.aggregations.childRank.scientificName.buckets[0]);
              }
            },
            err => {
              console.log(err);
              this.spinner.hide();
            }
        );
  }

  // tslint:disable-next-line:typedef
  getSearchResults(from?, size?) {
    this.router.navigate(['data'], {});
    this.resetTaxaTree();
    $('.biosamples-inactive').removeClass('non-disp active-filter');
    $('.raw-data-inactive').removeClass('non-disp active-filter');
    $('.mapped-reads-inactive').removeClass('non-disp active-filter');
    $('.assemblies-inactive').removeClass('non-disp active-filter');
    $('.annotation-complete-inactive').removeClass('non-disp active-filter');
    $('.annotation-inactive').removeClass('non-disp active-filter');

    if (this.searchText.length == 0) {
      this.getAllBiosamples(0, 15, this.sort.active, this.sort.direction);
      this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
    }
    else {
      this.activeFilters = [];
      this.dashboardService.getRootSearchResults(this.searchText, this.sort.active, this.sort.direction, from, size)
          .subscribe(
              data => {
                const unpackedData = [];
                for (const item of data.hits.hits) {
                  unpackedData.push(this.unpackData(item));
                }
                this.bioSampleTotalCount = data.hits.total.value;
                this.dataSource = new MatTableDataSource<any>(unpackedData);
                this.dataSource.sort = this.sort;
                this.dataSource.filterPredicate = this.filterPredicate;
                this.unpackedData = unpackedData;
                this.filtersMap = data;
                this.parseFilterAggregation(data);
                this.childTaxanomy.superkingdom = [{ parent: 'Eukaryota', rank: 'kingdom', expanded: false, childData: data.aggregations.kingdomRank.scientificName.buckets }];
                this.spinner.hide();
              },
              err => {
                console.log(err);
                this.spinner.hide();
              }
          );
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

  // Ontology aware filter
  initTaxonomyObject() {
    this.childTaxanomy = {
      cellularorganism: [{ parent: 'Root', rank: 'superkingdom', expanded: false, childData: [{ key: 'Eukaryota', doc_count: '1', commonName: {buckets: []} }] }],
      superkingdom: [],
      kingdom: [],
      subkingdom: [],
      superphylum: [],
      phylum: [],
      subphylum: [],
      superclass: [],
      class: [],
      subclass: [],
      infraclass: [],
      cohort: [],
      subcohort: [],
      superorder: [],
      order: [],
      parvorder: [],
      suborder: [],
      infraorder: [],
      section: [],
      subsection: [],
      superfamily: [],
      family: [],
      subfamily: [],
      tribe: [],
      subtribe: [],
      genus: [],
      series: [],
      subgenus: [],
      species_group: [],
      species_subgroup: [],
      species: [],
      subspecies: [],
      varietas: [],
      forma: []
    };
    this.taxonomies = [
      'cellularorganism',
      'superkingdom',
      'kingdom',
      'subkingdom',
      'superphylum',
      'phylum',
      'subphylum',
      'superclass',
      'class',
      'subclass',
      'infraclass',
      'cohort',
      'subcohort',
      'superorder',
      'order',
      'parvorder',
      'suborder',
      'infraorder',
      'section',
      'subsection',
      'superfamily',
      'family',
      'subfamily',
      'tribe',
      'subtribe',
      'genus',
      'series',
      'subgenus',
      'species_group',
      'species_subgroup',
      'species',
      'subspecies',
      'varietas',
      'forma'
    ];
    $('#myUL, #root-list, #Eukaryota-superkingdom').toggleClass('active');
  }

  toggleTaxanomy(rank, taxonomy) {
    $('#' + rank).toggleClass('active');
  }

  showTaxonomyModal(event: any, rank: string, taxonomy: string, childRank: string) {
    this.paginator.pageIndex = 0;
    this.searchText = '';
    this.isDoubleClick = false;
    setTimeout(() => {
      if (!this.isDoubleClick) {
        $('#myUL').css('display', 'none');
        this.modalTaxa = taxonomy;
        if ($(event.target).hasClass('active-filter')) {
          const taxa = { rank: 'superkingdom', taxonomy: 'Eukaryota', childRank: 'kingdom' };
          this.currentTaxonomyTree = [];
          this.currentTaxonomyTree = [taxa];
          this.currentTaxonomy = taxa;
          this.selectedFilterValue = '';
          $(event.target).removeClass('active-filter');
          this.getActiveFiltersAndResult();
          setTimeout(() => {
            this.isFilterSelected = false;
            $('#myUL').css('display', 'block');
          }, 250);
        }
        else {
          this.spinner.show();
          this.resetTaxaTree();
          this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
          $('.kingdom, .subkingdom').removeClass('active-filter');
          setTimeout(() => {
            this.getChildTaxonomyRank(rank, taxonomy, childRank);
            $(event.target).addClass('active-filter');
            this.modalTaxa = taxonomy;
          }, 150);

          setTimeout(() => {
            $('#myUL').css('display', 'block');
            $('.subkingdom').addClass('active');
            $('#taxonomyModal').modal({ backdrop: 'static', keyboard: false });
            $('#taxonomyModal').modal('show');
            $('.modal-backdrop').show();
            this.spinner.hide();
          }, 900);
        }
      }
    }, 250);
  }

  getChildTaxonomyRank(rank: string, taxonomy: string, childRank: string) {
    const taxa = { rank: rank, taxonomy: taxonomy, childRank: childRank };
    this.currentTaxonomy = (this.currentTaxonomyTree !== undefined && this.currentTaxonomyTree.length  > 0) ? this.currentTaxonomyTree : taxa;
    this.createTaxaTree(rank, taxa);
    if (this.showElement) {
      this.taxanomyService.getChildTaxonomyRank(this.activeFilters, rank, taxonomy, childRank, this.currentTaxonomyTree, 'data').subscribe(
          data => {
            this.parseAndPushTaxaData(rank, data);
            setTimeout(() => {
              const childRankIndex = this.taxonomies.findIndex(x => x === data[rank].rank);
              const childData = data[rank].childData;
              if (childData.length == 1 && childData[0].key === 'Other') {
                if (this.taxonomies[childRankIndex + 1] != undefined) {
                  const taxa = { rank: data[rank].rank, taxonomy: 'Other', childRank: this.taxonomies[childRankIndex + 1] };
                  this.getChildTaxonomyRank(taxa.rank, taxa.taxonomy, taxa.childRank);
                }
              }
              else {
                this.currentTaxaOnExpand = this.currentTaxonomy;
                if ((childData.length > 1 && childData.filter(function(e) { return e.key === 'Other'; }).length > 0) || (childData.length == 1 && this.currentTaxaOnExpand.taxonomy === 'Other')) {
                  const childClass = 'Other-' + this.currentTaxaOnExpand.childRank;
                  $('ul.' + childClass).css('padding-inline-start', '40px');
                }
              }
              setTimeout(() => {
                $('.' + taxonomy + '-' + childRank).addClass('active');
              }, 120);
            }, 100);
          },
          err => {
            console.log(err);
          });
    }
  }

  getChildTaxonomyRankEvent(event, rank: string, taxonomy: string, childRank: string) {
    this.spinner.show();
    $('#myUL').css('display', 'none');
    setTimeout(() => {
      const taxa = { rank: rank, taxonomy: taxonomy, childRank: childRank };
      this.currentTaxaOnExpand = taxa;
      if ($(event.target).hasClass('fa-plus-circle')) {
        this.getChildTaxonomyRank(rank, taxonomy, childRank);
        setTimeout(() => {
          $(event.target).removeClass('fa-plus-circle');
          $(event.target).addClass('fa-minus-circle');
          setTimeout(() => {
            $('#myUL').css('display', 'block');
            this.spinner.hide();
          }, 850);
        }, 100);
      }
      else if ($(event.target).hasClass('fa-minus-circle')) {
        this.spinner.show();
        $(event.target).removeClass('fa-minus-circle');
        $(event.target).addClass('fa-plus-circle');
        this.removeRankFromTaxaTree(taxa);
        setTimeout(() => {
          $('#myUL').css('display', 'block');
          this.spinner.hide();
        }, 200);
      }
    }, 250);
  }

  filterTaxonomy(rank: string, taxonomy: string, childRank: string, commonName) {
    this.paginator.pageIndex = 0;
    this.isDoubleClick = true;
    const taxa = { rank: rank, taxonomy: taxonomy, childRank: childRank, commonName: commonName };
    this.selectedFilterValue = taxa;
    this.createTaxaTree(rank, taxa);
    this.selectedTaxonomy.push(taxa);
    $('#taxonomyModal').modal('hide');
    $('.modal-backdrop').hide();
    setTimeout(() => {
      const treeLength = this.currentTaxonomyTree.length;
      this.currentTaxonomy = this.currentTaxonomyTree[treeLength - 1];
      this.getActiveFiltersAndResult(this.currentTaxonomyTree);
    }, 300);
    setTimeout(() => {
      this.isFilterSelected = true;
      $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
      this.isDoubleClick = false;
    }, 350);

  }

  parseAndPushTaxaData(rank, data) {
    const temp = this.childTaxanomy[rank];

    if (temp.length > 0) {
      if (!(temp.filter(function(e) { return e.parent === data[rank].parent; }).length > 0)) {
        this.childTaxanomy[rank].push(data[rank]);
      }
    }
    else {
      this.childTaxanomy[rank].push(data[rank]);
    }
  }

  createTaxaTree(rank, taxa) {
    const temp = this.currentTaxonomyTree;
    if (temp.length > 0) {
      if (!(temp.filter(function(e) { return e.rank === taxa.rank; }).length > 0)) {
        if (!(temp.filter(function(e) { return (e.taxonomy === taxa.taxonomy && e.rank === taxa.rank); }).length > 0)) {
          this.currentTaxonomyTree.push(taxa);
        }
      }
      else {
        if (!(temp.filter(function(e) { return (e.taxonomy === taxa.taxonomy && e.rank === taxa.rank); }).length > 0)) {
          const index = temp.findIndex(x => x.rank === taxa.rank);
          let itemsToremove = this.currentTaxonomyTree;
          const prevTaxaToRemove = this.currentTaxonomyTree[this.currentTaxonomyTree.length - 1];
          this.currentTaxonomyTree = this.currentTaxonomyTree.slice(0, index);
          itemsToremove = itemsToremove.splice(index);
          itemsToremove.forEach(element => {
            $('.' + element.taxonomy + '-' + element.childRank).removeClass('active');
          });
          const taxaIndex = this.taxonomies.findIndex(x => x === taxa.rank) + 1;

          for (let i = taxaIndex; i < this.taxonomies.length; i++) {
            this.childTaxanomy[this.taxonomies[i]] = [];
          }
          this.currentTaxonomyTree.push(taxa);
          this.showElement = true;
          $('#' + prevTaxaToRemove.taxonomy + '-' + prevTaxaToRemove.rank).prev().removeClass('fa-minus-circle');
          $('#' + prevTaxaToRemove.taxonomy + '-' + prevTaxaToRemove.rank).prev().addClass('fa-plus-circle');
        }
        else if (!this.isDoubleClick){
          const index = temp.findIndex(x => x.rank === taxa.rank);
          let itemsToremove = this.currentTaxonomyTree;
          const prevTaxaToRemove = this.currentTaxonomyTree[this.currentTaxonomyTree.length - 1];
          this.currentTaxonomyTree = this.currentTaxonomyTree.slice(0, index);
          itemsToremove = itemsToremove.splice(index);
          itemsToremove.forEach(element => {
            $('.' + element.taxonomy + '-' + element.childRank).removeClass('active');
          });
          const taxaIndex = this.taxonomies.findIndex(x => x === taxa.rank) + 1;
          for (let i = taxaIndex; i < this.taxonomies.length; i++) {
            this.childTaxanomy[this.taxonomies[i]] = [];
          }
          if (this.isDoubleClick) {
            this.currentTaxonomyTree.push(taxa);
          }
          this.showElement = true;
          $('#' + prevTaxaToRemove.taxonomy + '-' + prevTaxaToRemove.rank).prev().removeClass('fa-minus-circle');
          $('#' + prevTaxaToRemove.taxonomy + '-' + prevTaxaToRemove.rank).prev().addClass('fa-plus-circle');
        }
      }
    }
    else {
      this.currentTaxonomyTree.push(taxa);
    }
  }

  resetTaxaTree() {
    $('.nested').removeClass('active');
    this.selectedTaxonomy = [];
    this.currentTaxonomyTree = [];
    this.modalTaxa = '';
    this.initTaxonomyObject();
  }

  hideTaxaModal() {
    this.spinner.show();
    this.resetTaxaTree();
    this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
    $('.kingdom, .subkingdom').removeClass('active-filter');
    setTimeout(() => {
      if (this.activeFilters.length !== 0 || this.currentTaxonomyTree.length != 0) {
        const taxa = [this.currentTaxonomyTree];
        this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, taxa);
      }
      else {
        this.router.navigate(['data'], {});
        this.dataSource.filter = undefined;
        this.getFilters();
        this.getAllBiosamples(0, 15, this.sort.active, this.sort.direction);
        this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
      }
      this.spinner.hide();
    }, 250);
  }

  removeRankFromTaxaTree(taxa) {
    const temp = this.currentTaxonomyTree;
    const index = temp.findIndex(x => x.rank === taxa.rank);
    let itemsToremove = this.currentTaxonomyTree;
    this.currentTaxonomyTree = this.currentTaxonomyTree.slice(0, index);
    itemsToremove = itemsToremove.splice(index);
    const taxaIndex = this.taxonomies.findIndex(x => x === taxa.rank);
    for (let i = taxaIndex; i < this.taxonomies.length; i++) {
      const taxRank = this.taxonomies[i];
      this.childTaxanomy[taxRank] = [];
    }
    setTimeout(() => {
      this.currentTaxonomy = this.currentTaxonomyTree[this.currentTaxonomyTree.length - 1];
    }, 50);
  }

  checkTolidExists(data) {
    return data != undefined && data.tolid != undefined && data.tolid != null;
  }

  checkGenomeExists(data) {
    return data != undefined && data.genome_notes != undefined && data.genome_notes != null && data.genome_notes.length;
  }

  generateTolidLink(data) {
    const organismName = data.organism.split(' ').join('_');
    const clade = this.codes[data.tolid.charAt(0)];
    return `https://tolqc.cog.sanger.ac.uk/darwin/${clade}/${organismName}`;
  }

  getGenomeURL(data) {
    const genomeNotes = data.genome_notes;
    let genomeNotesURL = '#';
    if (genomeNotes != null && genomeNotes != undefined) {
      genomeNotesURL = genomeNotes[0].url;
    }
    return genomeNotesURL;
  }

  parseFilterAggregation(data: any) {
    this.filtersMap = data;
    this.BiosamplesFilters = this.filtersMap.aggregations.biosamples.buckets.filter(i => {
      if (i !== '' && i.key.toLowerCase() === 'done') {
        const obj = i;
        obj.key = 'Biosamples - ' + obj.key;
        return obj;
      }
    });
    this.RawDataFilters = this.filtersMap.aggregations.raw_data.buckets.filter(i => {
      if (i !== '' && i.key.toLowerCase() === 'done') {
        const obj = i;
        obj.key = 'Raw data - ' + obj.key;
        return obj;
      }
    });
    this.MappedReadsFilters = this.filtersMap.aggregations.mapped_reads.buckets.filter(i => {
      if (i !== '' && i.key.toLowerCase() === 'done') {
        const obj = i;
        obj.key = 'Mapped reads - ' + obj.key;
        return obj;
      }
    });
    this.AssembliesFilters = this.filtersMap.aggregations.assemblies.buckets.filter(i => {
      if (i !== '' && i.key.toLowerCase() === 'done') {
        const obj = i;
        obj.key = 'Assemblies - ' + obj.key;
        return obj;
      }
    });
    this.AnnotationCompleteFilters = this.filtersMap.aggregations.annotation_complete.buckets.filter(i => {
      if (i !== '' && i.key.toLowerCase() === 'done') {
        const obj = i;
        obj.key = 'Annotation complete - ' + obj.key;
        return obj;
      }
    });
    this.AnnotationFilters = this.filtersMap.aggregations.annotation.buckets.filter(i => {
      if (i !== '' && i.key.toLowerCase() === 'done') {
        const obj = i;
        obj.key = 'Annotation - ' + obj.key;
        return obj;
      }
    });
  }

}
