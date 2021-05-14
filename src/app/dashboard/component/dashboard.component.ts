import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Sample, samples } from '../model/dashboard.model';
import { DashboardService } from '../services/dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { Taxonomy } from 'src/app/taxanomy/taxonomy.model';
import { TaxanomyService } from 'src/app/taxanomy/taxanomy.service';

import 'jquery';
import 'bootstrap';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns = ['organism', 'commonName', 'trackingSystem'];
  bioSamples: Sample[];
  loading = true;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

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

  constructor(private titleService: Title, private dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService, private taxanomyService: TaxanomyService) { }

  ngOnInit(): void {
    this.activeFilters = [];
    this.urlAppendFilterArray = [];
    this.filterSize = 3;
    this.itemLimitSexFilter = this.filterSize;
    this.itemLimitOrgFilter = this.filterSize;
    this.itemLimitTrackFilter = this.filterSize;
    this.titleService.setTitle('Data portal');
    this.getOrganismsQueryParamonInit();
    this.selectedTaxonomy = [];
    this.isFilterSelected = false;
    this.selectedFilterValue = '';
    this.currentTaxaOnExpand = '';
    this.resetTaxaTree();
    $('[data-toggle="tooltip"]').tooltip();
    this.currentTaxonomyTree = [];
    this.isDoubleClick = false;
    this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
  }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getOrganismsQueryParamonInit() {
    const queryParamMap = this.activatedRoute.snapshot['queryParamMap'];
    const params = queryParamMap['params'];
    if (Object.keys(params).length != 0) {
      for (let key in params) {
        this.appendActiveFilters(key, params);
      }
      setTimeout(() => {
        this.getActiveFiltersAndResult();
      }, 50);
    }
    else {
      this.getAllBiosamples(0, 15, this.sort.active, this.sort.direction);
    }
  }

  appendActiveFilters(key, params) {
    setTimeout(() => {
      this.urlAppendFilterArray.push({ "name": key, "value": params[key] });
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
          let trackingSystemMap = this.filtersMap.aggregations.trackingSystem.buckets;
          this.trackingSystemFilters = trackingSystemMap.filter(i => i !== "");
          this.childTaxanomy['superkingdom'] = [{ 'parent': 'Eukaryota', 'rank': 'kingdom', 'expanded': false, 'childData': data.aggregations.filters.kingdomRank.buckets }];
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
          }, 100)
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
      )
  }

  pageChanged(event) {
    let taxonomy = [this.currentTaxonomyTree];
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let previousSize = pageSize * pageIndex;

    let from = pageIndex * pageSize;
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
      this.getNextBiosamples(previousSize, (pageIndex).toString(), pageSize.toString(), this.sort.active, this.sort.direction);
      setTimeout(() => {
        $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
      }, 250);
    }
  }

  customSort(event) {
    let taxonomy = [this.currentTaxonomyTree];
    this.paginator.pageIndex = 0;
    let pageIndex = this.paginator.pageIndex;
    let pageSize = this.paginator.pageSize;
    let from = pageIndex * pageSize;
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
    if (filters[1] === 'Sex') {
      return data.sex.toLowerCase() === filters[0];
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
      if (key === 'commonName' && data[key] == null) {
        dataToReturn[key] = "-"
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
    let taxonomy = [this.currentTaxonomyTree];
    this.searchText = "";
    let filterQueryParam = { "name": label.replace(" ", "-").toLowerCase(), "value": filter };
    let inactiveClassName = label.toLowerCase().replace(" ", "-") + '-inactive';
    const filterIndex = this.activeFilters.indexOf(filter);
    if (filterIndex !== -1) {
      $('.' + inactiveClassName).removeClass('non-disp');
      this.removeFilter(filter);
    } else {
      this.selectedFilterArray(label, filter);
      this.activeFilters.push(filter);
      this.dataSource.filter = `${filter.trim().toLowerCase()}|${label}`;
      this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, taxonomy);
      this.updateActiveRouteParams();
      $('.' + inactiveClassName).addClass('non-disp');
      $(event.target).removeClass('non-disp');
      $(event.target).addClass('disp');
      if (this.currentTaxonomyTree.length > 1) {
        setTimeout(() => {
          $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
        }, 250);
      }
    }

  }

  selectedFilterArray(key: string, value: string) {
    let jsonObj: {};
    if (key.replace(" ", "-").toLowerCase() == 'sex') {
      jsonObj = { "name": "sex", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    }
    else if (key.replace(" ", "-").toLowerCase() == "tracking-status") {
      jsonObj = { "name": "tracking-status", "value": value };
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
    this.isFilterSelected = false;
    $('#' + this.modalTaxa + '-kingdom').removeClass('active-filter')
    $('.sex-inactive').removeClass('non-disp');
    $('.tracking-status-inactive').removeClass('non-disp');
    this.resetTaxaTree()
    this.activeFilters = [];
    this.urlAppendFilterArray = [];
    this.dataSource.filter = undefined;
    this.getFilters();
    this.getAllBiosamples(0, 15, this.sort.active, this.sort.direction);
    this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
    this.modalTaxa = "";
    this.router.navigate(['data'], {});
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 800);
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
        this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, [this.currentTaxonomyTree]);
        if (this.currentTaxonomyTree.length > 1) {
          setTimeout(() => {
            $('#' + this.modalTaxa + '-kingdom').addClass('active-filter')
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
          $('#' + this.modalTaxa + '-kingdom').addClass('active-filter')
        }, 250);
      }
      else {
        this.isFilterSelected = false;
        this.removeRankFromTaxaTree('superkingdom');
        this.dataSource.filter = undefined;
        this.activeFilters = [];
        this.urlAppendFilterArray = [];
        this.dataSource.filter = undefined;
        this.getFilters();
        this.getAllBiosamples(0, 15, this.sort.active, this.sort.direction);
        this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
        this.modalTaxa = "";
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
        // this.sexFilters = this.filtersMap.sex.filter(i => i !== "");
        this.trackingSystemFilters = this.filtersMap.trackingSystem.filter(i => i !== "");
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

  getFilterResults(filter, sortColumn?, sortOrder?, from?, size?, taxonomyFilter?) {
    this.spinner.show();
    this.dashboardService.getFilterResults(filter, this.sort.active, this.sort.direction, from, size, taxonomyFilter)
      .subscribe(
        data => {
          this.selectedTaxonomy = []
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
          let trackingSystemMap = this.filtersMap.aggregations.trackingSystem.buckets;
          this.trackingSystemFilters = trackingSystemMap.filter(i => i !== "");
          this.childTaxanomy['superkingdom'] = [{ 'parent': 'Eukaryota', 'rank': 'kingdom', 'expanded': false, 'childData': data.aggregations.filters.kingdomRank.buckets }];
          this.spinner.hide();
          if (data.aggregations.filters != undefined) {
            this.selectedTaxonomy.push(data.aggregations.filters.childRank.buckets[0]);
          }
        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      )
  }

  // tslint:disable-next-line:typedef
  getSearchResults(from?, size?) {
    this.router.navigate(['data'], {});
    this.resetTaxaTree();
    $('.sex-inactive').removeClass('non-disp active-filter');
    $('.tracking-status-inactive').removeClass('non-disp active-filter');
    // this.spinner.show();
    if (this.searchText.length == 0) {
      this.getAllBiosamples(0, 15, this.sort.active, this.sort.direction);
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
            // let sexFilterMap = this.filtersMap.aggregations.sex.buckets;
            let trackingSystemMap = this.filtersMap.aggregations.trackingSystem.buckets;
            // this.sexFilters = sexFilterMap.filter(i => i !== "");
            this.trackingSystemFilters = trackingSystemMap.filter(i => i !== "");
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
  }

  // Ontology aware filter
  initTaxonomyObject() {
    this.childTaxanomy = {
      cellularorganism: [{ parent: 'Root', rank: 'superkingdom', expanded: false, childData: [{ key: 'Eukaryota', doc_count: '1' }] }],
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
      "cellularorganism",
      "superkingdom",
      "kingdom",
      "subkingdom",
      "superphylum",
      "phylum",
      "subphylum",
      "superclass",
      "class",
      "subclass",
      "infraclass",
      "cohort",
      "subcohort",
      "superorder",
      "order",
      "parvorder",
      "suborder",
      "infraorder",
      "section",
      "subsection",
      "superfamily",
      "family",
      "subfamily",
      "tribe",
      "subtribe",
      "genus",
      "series",
      "subgenus",
      "species_group",
      "species_subgroup",
      "species",
      "subspecies",
      "varietas",
      "forma"
    ];
    $('#myUL, #root-list, #Eukaryota-superkingdom').toggleClass("active");
  }

  toggleTaxanomy(rank, taxonomy) {
    $('#' + rank).toggleClass("active");
  }

  showTaxonomyModal(event: any, rank: string, taxonomy: string, childRank: string) {
    $('#myUL').css('display', 'none');
    this.modalTaxa = taxonomy;
    if ($(event.target).hasClass('active-filter')) {
      let taxa = { 'rank': 'superkingdom', 'taxonomy': 'Eukaryota', 'childRank': 'kingdom' };
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
        $(".modal-backdrop").show();
        this.spinner.hide();
      }, 400);
    }
  }

  getChildTaxonomyRank(rank: string, taxonomy: string, childRank: string) {
    let taxa = { 'rank': rank, 'taxonomy': taxonomy, 'childRank': childRank };
    this.currentTaxonomy = taxa;
    this.createTaxaTree(rank, taxa);
    if (this.showElement) {
      this.taxanomyService.getChildTaxonomyRank(this.activeFilters, rank, taxonomy, childRank, this.currentTaxonomyTree, 'data').subscribe(
        data => {
          this.parseAndPushTaxaData(rank, data);
          setTimeout(() => {
            let childRankIndex = this.taxonomies.findIndex(x => x === data[rank].rank);
            let childData = data[rank].childData;
            if (childData.length == 1 && childData[0].key === 'Other') {
              if (this.taxonomies[childRankIndex + 1] != undefined) {
                let taxa = { 'rank': data[rank].rank, 'taxonomy': 'Other', 'childRank': this.taxonomies[childRankIndex + 1] };
                this.getChildTaxonomyRank(taxa.rank, taxa.taxonomy, taxa.childRank);
              }
            }
            else {
              this.currentTaxaOnExpand = this.currentTaxonomy;
              if ((childData.length > 1 && childData.filter(function (e) { return e.key === 'Other'; }).length > 0) || (childData.length == 1 && this.currentTaxaOnExpand.taxonomy === 'Other')) {
                let childClass = 'Other-' + this.currentTaxaOnExpand.childRank;
                $('ul.' + childClass).css('padding-inline-start', '40px');
              }
            }
            $('.' + taxonomy + '-' + childRank).addClass("active");
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
      let taxa = { 'rank': rank, 'taxonomy': taxonomy, 'childRank': childRank };
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

  filterTaxonomy(rank: string, taxonomy: string, childRank: string, count) {
    this.isDoubleClick = true;
    let taxa = { 'rank': rank, 'taxonomy': taxonomy, 'childRank': childRank };
    this.selectedFilterValue = taxa;
    this.createTaxaTree(rank, taxa);
    this.selectedTaxonomy.push(taxa);
    $('#taxonomyModal').modal('hide');
    $(".modal-backdrop").hide();
    setTimeout(() => {
      let treeLength = this.currentTaxonomyTree.length;
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
    let temp = this.childTaxanomy[rank];

    if (temp.length > 0) {
      if (!(temp.filter(function (e) { return e.parent === data[rank].parent; }).length > 0)) {
        this.childTaxanomy[rank].push(data[rank]);
      }
    }
    else {
      this.childTaxanomy[rank].push(data[rank]);
    }
  }

  createTaxaTree(rank, taxa) {
    let temp = this.currentTaxonomyTree;
    if (temp.length > 0) {
      if (!(temp.filter(function (e) { return e.rank === taxa.rank; }).length > 0)) {
        if (!(temp.filter(function (e) { return (e.taxonomy === taxa.taxonomy && e.rank === taxa.rank) }).length > 0)) {
          this.currentTaxonomyTree.push(taxa);
        }
      }
      else {
        if (!(temp.filter(function (e) { return (e.taxonomy === taxa.taxonomy && e.rank === taxa.rank) }).length > 0)) {
          let index = temp.findIndex(x => x.rank === taxa.rank);
          let itemsToremove = this.currentTaxonomyTree;
          let prevTaxaToRemove = this.currentTaxonomyTree[this.currentTaxonomyTree.length - 1];
          this.currentTaxonomyTree = this.currentTaxonomyTree.slice(0, index);
          itemsToremove = itemsToremove.splice(index);
          itemsToremove.forEach(element => {
            $('.' + element.taxonomy + '-' + element.childRank).removeClass("active");
          });
          let taxaIndex = this.taxonomies.findIndex(x => x === taxa.rank) + 1;

          for (let i = taxaIndex; i < this.taxonomies.length; i++) {
            this.childTaxanomy[this.taxonomies[i]] = [];
          }
          this.currentTaxonomyTree.push(taxa);
          this.showElement = true;
          $('#' + prevTaxaToRemove.taxonomy + '-' + prevTaxaToRemove.rank).prev().removeClass('fa-minus-circle');
          $('#' + prevTaxaToRemove.taxonomy + '-' + prevTaxaToRemove.rank).prev().addClass('fa-plus-circle');
        }
        else {
          let index = temp.findIndex(x => x.rank === taxa.rank);
          let itemsToremove = this.currentTaxonomyTree;
          let prevTaxaToRemove = this.currentTaxonomyTree[this.currentTaxonomyTree.length - 1];
          this.currentTaxonomyTree = this.currentTaxonomyTree.slice(0, index);
          itemsToremove = itemsToremove.splice(index);
          itemsToremove.forEach(element => {
            $('.' + element.taxonomy + '-' + element.childRank).removeClass("active");
          });
          let taxaIndex = this.taxonomies.findIndex(x => x === taxa.rank) + 1;
          for (let i = taxaIndex; i < this.taxonomies.length; i++) {
            this.childTaxanomy[this.taxonomies[i]] = [];
          }
          if(this.isDoubleClick) {
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
    $('.nested').removeClass("active");
    this.selectedTaxonomy = [];
    this.currentTaxonomyTree = [];
    this.modalTaxa = "";
    this.initTaxonomyObject();
  }

  hideTaxaModal() {
    this.spinner.show();
    this.resetTaxaTree();
    this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
    $('.kingdom, .subkingdom').removeClass('active-filter');
    setTimeout(() => {
      if (this.activeFilters.length !== 0 || this.currentTaxonomyTree.length != 0) {
        let taxa = [this.currentTaxonomyTree];
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
    let temp = this.currentTaxonomyTree;
    let index = temp.findIndex(x => x.rank === taxa.rank);
    let itemsToremove = this.currentTaxonomyTree;
    this.currentTaxonomyTree = this.currentTaxonomyTree.slice(0, index);
    itemsToremove = itemsToremove.splice(index);
    let taxaIndex = this.taxonomies.findIndex(x => x === taxa.rank);
    for (let i = taxaIndex; i < this.taxonomies.length; i++) {
      let taxRank = this.taxonomies[i];
      this.childTaxanomy[taxRank] = [];
    }
    setTimeout(() => {
      this.currentTaxonomy = this.currentTaxonomyTree[this.currentTaxonomyTree.length - 1];
    }, 50);
  }

}
