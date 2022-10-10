import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { StatusesService } from "../services/statuses.service";
import { NgxSpinnerService } from 'ngx-spinner';

import { Taxonomy } from 'src/app/taxanomy/taxonomy.model';
import { TaxanomyService } from 'src/app/taxanomy/taxanomy.service';

import 'jquery';

@Component({
  selector: 'app-tracking-system',
  templateUrl: './tracking-system.component.html',
  styleUrls: ['./tracking-system.component.css']
})
export class TrackingSystemComponent implements OnInit, AfterViewInit {
  displayedColumns = ['organism', 'commonName', 'metadata_submitted_to_biosamples',
    'raw_data_submitted_to_ena',  'assemblies_submitted_to_ena',
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

  AssembliesFilters = [];
  AnnotationFilters = [];
  AnnotationCompleteFilters = [];
  statusesTotalCount = 0;
  orgTotalCount = 0;
  unpackedData;
  showOrganismTable: boolean;
  orgName = '';

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

  taxaRankArray = ["superkingdom", "kingdom","subkingdom","superphylum","phylum","subphylum","superclass","class","subclass","infraclass","cohort","subcohort","superorder","order","suborder","infraorder","parvorder","section","subsection","superfamily","family","subfamily","tribe","subtribe","genus","series","subgenus","species_group","species_subgroup","species","subspecies","varietas","forma"]
  phylSelectedRank = '';

  constructor(private titleService: Title, private statusesService: StatusesService,
    private activatedRoute: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService, private taxanomyService: TaxanomyService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.isFilterSelected = false;
    this.searchText = '';
    this.showOrganismTable = false;
    this.activeFilters = [];
    this.urlAppendFilterArray = [];
    this.filterSize = 3;
    this.itemLimitBiosampleFilter = this.filterSize;
    this.itemLimitEnaFilter = this.filterSize;
    this.titleService.setTitle('Status tracking');
    this.getStatusesQueryParamonInit();
    this.selectedTaxonomy = [];
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

  getStatusesQueryParamonInit() {
    const queryParamMap = this.activatedRoute.snapshot['queryParamMap'];
    const params = queryParamMap['params'];
    if (Object.keys(params).length != 0) {
      for (let key in params) {
        if(key == 'phylogeny') {
          this.isFilterSelected = true;
          this.phylSelectedRank = params[key];
        }
        this.appendActiveFilters(key, params);
      }
      setTimeout(() => {
        this.getActiveFiltersAndResult();
      }, 80);
    }
    else {
      this.getAllStatuses(0, 15, this.sort.active, this.sort.direction);
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
    this.statusesService.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, taxonomy, this.searchText)
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
          this.parseFilterAggregation(data);
          this.childTaxanomy['superkingdom'] = [{ 'parent': 'Eukaryota', 'rank': 'kingdom', 'expanded': false, 'taxId': 2759, 'childData': data.aggregations.kingdomRank.scientificName.buckets }];
          if(this.phylSelectedRank != '') {
            let taxa = { 'rank': this.phylSelectedRank.split(' - ')[0], 'taxonomy': data.aggregations.childRank.scientificName.buckets[0].key, 'commonName': data.aggregations.childRank.scientificName.buckets[0].commonName.buckets[0].key, 'taxId': data.aggregations.childRank.scientificName.buckets[0].taxId.buckets[0].key};
            this.selectedFilterValue = taxa;
          }
          for (let i = 0; i < this.urlAppendFilterArray.length; i++) {
            setTimeout(() => {
              let inactiveClassName = '.' + this.urlAppendFilterArray[i].name + '-inactive';
              let element = "li:contains('" + this.urlAppendFilterArray[i].value + "')";
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
    this.getFilters();
    this.spinner.show();
    this.statusesService.getAllStatuses(offset, limit, sortColumn, sortOrder, this.searchText)
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
          }, 100)
        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      );
  }

  getNextStatuses(currentSize, offset, limit, sortColumn?, sortOrder?) {
    this.spinner.show();
    this.statusesService.getAllStatuses(offset, limit, sortColumn, sortOrder, this.searchText)
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
    let taxonomy = [this.currentTaxonomyTree];
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let previousSize = pageSize * pageIndex;

    let from = pageIndex * pageSize;
    let size = pageSize;

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
      this.getNextStatuses(previousSize, from, size, this.sort.active, this.sort.direction);
      setTimeout(() => {
        $('#' + this.modalTaxa + '-kingdom').addClass('active-filter');
      }, 250);
    }
  }

  // orgPageChanged(event) {
  //   let pageIndex = event.pageIndex;
  //   let pageSize = event.pageSize;
  //   let previousSize = pageSize * pageIndex;

  //   let from = pageIndex * pageSize;
  //   let size = 0;
  //   if ((from + pageSize) < this.statusesTotalCount) {
  //     size = from + pageSize;
  //   }
  //   else {
  //     size = this.statusesTotalCount;
  //   }

  //   this.findBioSampleByOrganismName(this.orgName, from, size);
  // }

  customSort(event) {
    let taxonomy = [this.currentTaxonomyTree];
    this.paginator.pageIndex = 0;
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
      this.getAllStatuses((pageIndex).toString(), pageSize.toString(), event.active, event.direction);
    }

  }

  // orgSort(event) {
  //   let pageIndex = this.paginator.pageIndex;
  //   let pageSize = this.paginator.pageSize;
  //   let from = pageIndex * pageSize;
  //   let size = 0;
  //   if ((from + pageSize) < this.statusesTotalCount) {
  //     size = from + pageSize;
  //   }
  //   else {
  //     size = this.orgTotalCount;
  //   }

  //   if (this.activeFilters.length !== 0) {
  //     this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, from, size);
  //   }
  //   else if (this.searchText.length !== 0) {
  //     this.getSearchResults(from, size);
  //   }
  //   else {
  //     this.getAllStatuses((pageIndex).toString(), pageSize.toString(), event.active, event.direction);
  //   }

  // }

  // tslint:disable-next-line:typedef
  filterPredicate(data: any, filterValue: any): boolean {
    const filters = filterValue.split('|');
    if (filters[1] === 'Metadata submitted to BioSamples') {
      return data.biosampleStatus === filters[0].split(' - ')[1];
    } else {
      const ena_filters = filters[0].split(' - ');
      if (ena_filters[0] === 'Raw Data') {
        return data.raw_data === ena_filters[1];
      }  else if (ena_filters[0] === 'Assemblies') {
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
      return 'active-filter';
    }
    if (this.selectedTaxonomy.indexOf(filter) !== -1) {
      return 'active-filter';
    }

  }

  // tslint:disable-next-line:typedef
  onFilterClick(event, label: string, filter: string) {
    this.paginator.pageIndex = 0;
    let taxonomy = [this.currentTaxonomyTree];
    // this.searchText = '';
    let inactiveClassName = label.toLowerCase().replace(" ", "-") + '-inactive';
    const filterIndex = this.activeFilters.indexOf(filter);
    if (filterIndex !== -1) {
      this.removeFilter(filter);
    } else {
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
      jsonObj = { "name": "biosamples", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == "raw-data") {
      jsonObj = { "name": "raw_data", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    }  else if (key.toLowerCase() == "assemblies") {
      jsonObj = { "name": "assemblies", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == "annotation-complete") {
      jsonObj = { "name": "annotation_complete", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == "annotation") {
      jsonObj = { "name": "annotation", "value": value };
      this.urlAppendFilterArray.push(jsonObj);
    } else if (key.toLowerCase() == "phylogeny") {
      jsonObj = { "name": "phylogeny", "value": value };
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
      this.router.navigate(['tracking'], { queryParams: params });
    }
    else {
      this.router.navigate(['tracking']);
    }
  }

  // tslint:disable-next-line:typedef
  removeAllFilters() {
    this.paginator.pageIndex = 0;
    this.isFilterSelected = false;
    this.selectedFilterValue = '';
    this.phylSelectedRank = '';
    $('#' + this.modalTaxa + '-kingdom').removeClass('active-filter')
    this.resetTaxaTree()
    this.modalTaxa = "";
    this.activeFilters = [];
    this.urlAppendFilterArray = [];
    this.dataSource.filter = undefined;
    if (this.searchText.length != 0) {
      this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, [this.currentTaxonomyTree]);
      this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
    }
    else {
      this.getFilters();
      this.getAllStatuses(0, 15, this.sort.active, this.sort.direction);
      this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
    }
    this.router.navigate(['tracking'], {});
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
            $('#' + this.modalTaxa + '-kingdom').addClass('active-filter')
          }, 250);
        }
      }
      else if (this.currentTaxonomyTree.length > 1) {
        this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, [this.currentTaxonomyTree]);
        setTimeout(() => {
          $('#' + this.modalTaxa + '-kingdom').addClass('active-filter')
        }, 250);
      }
      else if (this.searchText.length != 0) {
        this.modalTaxa = "";
        this.router.navigate(['tracking'], {});
        this.isFilterSelected = false;
        this.removeRankFromTaxaTree('superkingdom');
        this.dataSource.filter = undefined;
        this.activeFilters = [];
        this.urlAppendFilterArray = [];
        this.dataSource.filter = undefined;
        this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 15, [this.currentTaxonomyTree]);
        this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
      }
      else {
        this.isFilterSelected = false;
        this.selectedFilterValue = '';
        this.phylSelectedRank = '';
        this.removeRankFromTaxaTree('superkingdom');
        this.dataSource.filter = undefined;
        this.activeFilters = [];
        this.urlAppendFilterArray = [];
        this.dataSource.filter = undefined;
        this.getFilters();
        this.getAllStatuses(0, 15, this.sort.active, this.sort.direction);
        this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
        this.modalTaxa = "";
        this.router.navigate(['tracking'], {});
      }
    }
  }

  updateDomForRemovedFilter(filter: string) {
    if (this.urlAppendFilterArray.length != 0) {
      let inactiveClassName: string;
      this.urlAppendFilterArray.filter(obj => {
        if (obj.value == filter) {
          inactiveClassName = obj.name + '-inactive';
          $('.' + inactiveClassName).removeClass('active');
          const filterIndex = this.urlAppendFilterArray.indexOf(obj);
          this.urlAppendFilterArray.splice(filterIndex, 1);
        }
      });
    }
  }

  updateDomForRemovedPhylogenyFilter(filter: string) {
    if (this.urlAppendFilterArray.length != 0) {
      let inactiveClassName: string;
      this.urlAppendFilterArray.filter(obj => {
        if (obj.value == filter) {
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

        this.AssembliesFilters = this.filtersMap.assemblies.filter(i => i !== "");
        this.AnnotationCompleteFilters = this.filtersMap.annotation_complete.filter(i => i !== "");
        this.AnnotationFilters = this.filtersMap.annotation.filter(i => i !== "");
      },
      err => console.log(err)
    );


  }

  getStatusClass(status: string) {
    if (status != undefined) {
      if (status.toLowerCase().includes('waiting')) {
        return 'badge badge-pill badge-warning';
      } else {
        return 'badge badge-pill badge-success';
      }
    }
  }

  getFilterResults(filter, sortColumn?, sortOrder?, from?, size?, taxonomyFilter?) {
    this.spinner.show();
    this.statusesService.getFilterResults(filter, this.sort.active, this.sort.direction, from, size, taxonomyFilter, this.searchText)
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
          this.parseFilterAggregation(data);
          this.childTaxanomy['superkingdom'] = [{ 'parent': 'Eukaryota', 'rank': 'kingdom', 'expanded': false, 'taxId': 2759, 'childData': data.aggregations.kingdomRank.scientificName.buckets }];
          if (data.aggregations.filters != undefined) {
            this.selectedTaxonomy.push(data.aggregations.childRank.scientificName.buckets[0]);
          }
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
    this.router.navigate(['tracking'], {});
    this.resetTaxaTree();
    this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
    $('.kingdom, .subkingdom').removeClass('non-disp active-filter');
    $('.biosamples-inactive').removeClass('non-disp active-filter');
    $('.raw-data-inactive').removeClass('non-disp active-filter');
    $('.mapped-reads-inactive').removeClass('non-disp active-filter');
    $('.assemblies-inactive').removeClass('non-disp active-filter');
    $('.annotation-complete-inactive').removeClass('non-disp active-filter');
    $('.annotation-inactive').removeClass('non-disp active-filter');

    // this.spinner.show();
    if (this.searchText.length == 0) {
      this.getAllStatuses(0, 15, this.sort.active, this.sort.direction);
      this.getChildTaxonomyRank('superkingdom', 'Eukaryota', 'kingdom');
    }
    else {
      this.spinner.show()
      this.isFilterSelected = false;
      this.activeFilters = [];
      this.selectedFilterValue = '';
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
            this.childTaxanomy['superkingdom'] = [{ 'parent': 'Eukaryota', 'rank': 'kingdom', 'expanded': false, 'taxId': 2759, 'childData': data.aggregations.kingdomRank.scientificName.buckets }];
            this.parseFilterAggregation(data);
            if (data.aggregations.filters != undefined) {
              this.selectedTaxonomy.push(data.aggregations.childRank.scientificName.buckets[0]);
            }
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

  toggleOrganismTable() {
    $("#org-table").hide();
    $("#overlay").css({ "display": "none" });
    this.showOrganismTable = false;
    this.orgDataSource = new MatTableDataSource<any>();
    this.orgDataSource.sort = this.sort;
  }

  parseFilterAggregation(data: any) {
    this.filtersMap = data;
    this.BiosamplesFilters = this.filtersMap.aggregations.biosamples.buckets.filter(i => {
      if (i !== "" && i.key.toLowerCase() === "done") {
        let obj = i;
        obj.key = "Biosamples - " + obj.key;
        return obj;
      }
    });
    this.RawDataFilters = this.filtersMap.aggregations.raw_data.buckets.filter(i => {
      if (i !== "" && i.key.toLowerCase() === "done") {
        let obj = i;
        obj.key = "Raw data - " + obj.key;
        return obj;
      }
    });

    this.AssembliesFilters = this.filtersMap.aggregations.assemblies.buckets.filter(i => {
      if (i !== "" && i.key.toLowerCase() === "done") {
        let obj = i;
        obj.key = "Assemblies - " + obj.key;
        return obj;
      }
    });
    this.AnnotationCompleteFilters = this.filtersMap.aggregations.annotation_complete.buckets.filter(i => {
      if (i !== "" && i.key.toLowerCase() === "done") {
        let obj = i;
        obj.key = "Annotation complete - " + obj.key;
        return obj;
      }
    });
    this.AnnotationFilters = this.filtersMap.aggregations.annotation.buckets.filter(i => {
      if (i !== "" && i.key.toLowerCase() === "done") {
        let obj = i;
        obj.key = "Annotation - " + obj.key;
        return obj;
      }
    });
  }


  // Ontology aware filter
  initTaxonomyObject() {
    this.childTaxanomy = {
      cellularorganism: [{ parent: 'Root', rank: 'superkingdom', expanded: false, taxId: 2759, childData: [{ key: 'Eukaryota', doc_count: '1', commonName: {buckets:[]}, taxId: {buckets:[]} }] }],
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
    this.paginator.pageIndex = 0;
    // this.searchText = "";
    this.isDoubleClick = false;
    setTimeout(() => {
      if (!this.isDoubleClick) {
        $('#myUL').css('display', 'none');
        this.modalTaxa = taxonomy;
        if ($(event.target).hasClass('active-filter')) {
          this.spinner.show();
          let filter = this.selectedFilterValue.rank + ' - ' +this.selectedFilterValue.taxId;
          const filterIndex = this.activeFilters.indexOf(filter);
          if (filterIndex !== -1) {
            this.activeFilters.splice(filterIndex);
          }
          this.isFilterSelected = false;
          this.phylSelectedRank = '';
          setTimeout(() => {
            this.updateDomForRemovedPhylogenyFilter(filter);
            this.updateActiveRouteParams();
          }, 100);
          let taxa = { 'rank': 'superkingdom', 'taxonomy': 'Eukaryota', 'childRank': 'kingdom' };
          this.currentTaxonomyTree = [];
          this.currentTaxonomyTree = [taxa];
          this.currentTaxonomy = taxa;
          this.selectedFilterValue = '';
          $(event.target).removeClass('active-filter');
          $('#myUL').css('display', 'block');
          this.getActiveFiltersAndResult();
          setTimeout(() => {
            this.spinner.hide()
          }, 400);
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
          }, 900);
        }
      }
    }, 250);
  }

  removeTaxaFilter(taxonomy: any) {
    this.spinner.show();
    let filter = this.selectedFilterValue.rank + ' - ' +this.selectedFilterValue.taxId;
    const filterIndex = this.activeFilters.indexOf(filter);
    if (filterIndex !== -1) {
      this.activeFilters.splice(filterIndex);
    }
    this.isFilterSelected = false;
    this.phylSelectedRank = '';
    setTimeout(() => {
      this.updateDomForRemovedPhylogenyFilter(filter);
      this.updateActiveRouteParams();
    }, 100);
    let taxa = { 'rank': 'superkingdom', 'taxonomy': 'Eukaryota', 'childRank': 'kingdom' };
    this.currentTaxonomyTree = [];
    this.currentTaxonomyTree = [taxa];
    this.currentTaxonomy = taxa;
    this.selectedFilterValue = '';
    $(taxonomy+'-kingdom').removeClass('active-filter');
    $('#myUL').css('display', 'block');
    this.getActiveFiltersAndResult();
    setTimeout(() => {
      this.spinner.hide()
    }, 400);
  }

  getChildTaxonomyRank(rank: string, taxonomy: string, childRank: string) {
    let taxa = { 'rank': rank, 'taxonomy': taxonomy, 'childRank': childRank };
    this.currentTaxonomy = taxa;
    this.createTaxaTree(rank, taxa);
    if (this.showElement) {
      this.taxanomyService.getChildTaxonomyRank(this.activeFilters, rank, taxonomy, childRank, this.currentTaxonomyTree, 'status', this.searchText).subscribe(
        data => {
          this.parseAndPushTaxaData(rank, data);
          setTimeout(() => {
            let childRankIndex = this.taxonomies.findIndex(x => x === data[rank].rank);
            let childData = data[rank].childData;
            if (childData.length == 1 && childData[0].key.toLowerCase() === 'other') {
              if (this.taxonomies[childRankIndex + 1] != undefined) {
                let taxa = { 'rank': data[rank].rank, 'taxonomy': 'Other', 'childRank': this.taxonomies[childRankIndex + 1] };
                this.getChildTaxonomyRank(taxa.rank, taxa.taxonomy, taxa.childRank);
              }
            }
            else {
              this.currentTaxaOnExpand = this.currentTaxonomy;
              if ((childData.length > 1 && childData.filter(function (e) { return e.key.toLowerCase() === 'other'; }).length > 0) || (childData.length == 1 && this.currentTaxaOnExpand.taxonomy.toLowerCase() === 'other')) {
                let childClass = 'other-' + this.currentTaxaOnExpand.childRank;
                $('ul.' + childClass).css('padding-inline-start', '40px');
              }
            }
            setTimeout(() => {
              $('.' + taxonomy + '-' + childRank).addClass("active");
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
        // TODO check removeRankFromTaxaTree to remove this
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

  filterTaxonomy(rank: string, taxonomy: string, childRank: string, commonName, taxId) {
    let taxa = { 'rank': rank, 'taxonomy': taxonomy, 'childRank': childRank, 'commonName': commonName, 'taxId': taxId };
    this.selectedFilterValue = taxa;
    let filterObj = rank + ' - ' +taxId;
    this.selectedFilterArray('phylogeny', filterObj);
    this.updateActiveRouteParams();
    this.paginator.pageIndex = 0;
    this.isDoubleClick = true;
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
        this.getAllStatuses(0, 15, this.sort.active, this.sort.direction);
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

  downloadCSV() {
    let taxonomy = [this.currentTaxonomyTree];
    this.statusesService.downloadCSV(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, 5000, taxonomy, this.searchText).subscribe(data => {
			const blob = new Blob([data], {type: 'application/csv'});
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "organism-statuses-metadata.csv";
      link.click();
		}), error => console.log('Error downloading the file'),
                 () => console.info('File downloaded successfully');
  }

}
