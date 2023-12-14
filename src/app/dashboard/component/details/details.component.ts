import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sample, samples } from '../../model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator as MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  bioSampleId;
  bioSampleObj;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSourceRecords;
  specBioSampleTotalCount;
  specDisplayedColumns = ['accession', 'organism', 'commonName', 'sex', 'organismPart'];


  isSexFilterCollapsed = true;
  isOrganismPartCollapsed = true;
  itemLimitSexFilter: number;
  itemLimitOrgFilter: number;
  filterSize: number;
  searchText = '';
  activeFilters = [];
  filtersMap;
  filters = {
    sex: {},
    organismPart: {}
  };
  sexFilters = [];
  organismPartFilters = [];
  unpackedData;
  organismName;
  relatedRecords;
  filterJson = {
    sex: "",
    organismPart: "",
  };

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private router: Router) {
    this.route.params.subscribe(param => this.bioSampleId = param.id);
  }

  ngOnInit(): void {
    this.activeFilters = [];
    this.filterSize = 3;
    this.itemLimitSexFilter = this.filterSize;
    this.itemLimitOrgFilter = this.filterSize;
    this.relatedRecords = [];
    this.filterJson['sex'] = '';
    this.filterJson['organismPart'] = '';
    this.getBiosamples();
  }

  // tslint:disable-next-line:typedef
  getBiosamples() {
    this.dashboardService.getBiosampleByAccession(this.bioSampleId)
      .subscribe(
        data => {
          const unpackedData = [];
          for (const item of data.hits.hits) {
            unpackedData.push(this.unpackData(item));
          }
          this.bioSampleObj = unpackedData[0];
          if (this.bioSampleObj.specimens.length > 0) {
            this.bioSampleObj.specimens.filter(obj => {
              if (obj.commonName == null) {
                obj.commonName = "-";
              }
            });
            this.getFiltersForSelectedFilter(this.bioSampleObj.specimens);
          }
          setTimeout(() => {
            this.organismName = data.organism;
            this.dataSourceRecords = new MatTableDataSource<any>(this.bioSampleObj.specimens);
            this.specBioSampleTotalCount = unpackedData?.length;
            this.dataSourceRecords.paginator = this.paginator;
            this.dataSourceRecords.sort = this.sort;
          }, 50);
        },
        err => console.log(err)
      );
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
    this.dataSourceRecords.filterPredicate = ((data, filter) => {
      const a = !filter.sex || data.sex === filter.sex;
      const b = !filter.organismPart || data.organismPart === filter.organismPart;
      return a && b;
    }) as (PeriodicElement, string) => boolean;
  }

  getFiltersForSelectedFilter(data: any) {
    const filters = {
      sex: {},
      organismPart: {}
    };
    this.sexFilters = [];
    this.organismPartFilters = [];

    this.filters = filters;
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
    this.filters = filters;
    const sexFilterObj = Object.entries(this.filters.sex);
    const orgFilterObj = Object.entries(this.filters.organismPart);
    let j = 0;
    for (let i = 0; i < sexFilterObj.length; i++) {
      let jsonObj = { "key": sexFilterObj[i][j], doc_count: sexFilterObj[i][j + 1] };
      this.sexFilters.push(jsonObj);
    }
    for (let i = 0; i < orgFilterObj.length; i++) {
      let jsonObj = { "key": orgFilterObj[i][j], doc_count: orgFilterObj[i][j + 1] };
      this.organismPartFilters.push(jsonObj);
    }
  }

  removeAllFilters() {
    $('.sex-inactive').removeClass('non-disp');
    $('.org-part-inactive').removeClass('non-disp');
    this.activeFilters = [];
    this.filterJson['sex'] = '';
    this.filterJson['organismPart'] = '';
    this.dataSourceRecords.filter = this.filterJson;
    this.getBiosamples();
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
        this.dataSourceRecords.filter = this.filterJson;
        this.getBiosamples();
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
  }

  // tslint:disable-next-line:typedef
  getFilters(accession) {
    this.dashboardService.getSpecimenFilters(accession).subscribe(
      data => {
        this.filtersMap = data;
        this.sexFilters = this.filtersMap.sex.filter(i => i !== "");
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
    $('.org-part-inactive').removeClass('non-disp active');
    if (this.searchText.length == 0) {
      this.getBiosamples();
    }
    else {
      this.activeFilters = [];
      this.dataSourceRecords.filter = this.searchText.trim();
      this.dataSourceRecords.filterPredicate = ((data, filter) => {
        const a = !filter || data.sex.toLowerCase().includes(filter.toLowerCase());
        const b = !filter || data.organismPart.toLowerCase().includes(filter.toLowerCase());
        const c = !filter || data.accession.toLowerCase().includes(filter.toLowerCase());
        const d = !filter || data.commonName.toLowerCase().includes(filter.toLowerCase());
        return a || b || c || d;
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
