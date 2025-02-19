import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { Sample, samples } from '../dashboard/model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {ApiService} from '../api.service';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { NgClass } from '@angular/common';
import {ImageSliderComponent} from '../image-slider/image-slider.component';


@Component({
  selector: 'app-organism-details',
  templateUrl: './organism-details.component.html',
  styleUrls: ['./organism-details.component.css'],
  imports: [
    MatFormField,
    MatTable,
    MatInput,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatPaginator,
    FormsModule,
    NgClass,
    RouterLink,
    ImageSliderComponent
],
  standalone: true
})
export class OrganismDetailsComponent implements OnInit {

  bioSampleId;
  bioSampleObj;

  slides: any[];

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
    sex: '',
    organismPart: '',
  };
  private aggregations: any;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {
    this.route.params.subscribe(param => this.bioSampleId = param.organismId);
  }

  ngOnInit(): void {
    this.activeFilters = [];
    this.filterSize = 3;
    this.itemLimitSexFilter = this.filterSize;
    this.itemLimitOrgFilter = this.filterSize;
    this.relatedRecords = [];
    this.filterJson.sex = '';
    this.filterJson.organismPart = '';
    this.getBiosamples();
  }

  // tslint:disable-next-line:typedef
  getBiosamples() {
    this.apiService.getBiosampleByAccession(this.bioSampleId)
        .subscribe(
            data => {
              this.bioSampleObj = data.results[0]._source;
              this.aggregations = data.aggregations;
              this.slides = this.generateSlides(this.bioSampleObj);
              if (this.bioSampleObj.specimens.length > 0) {
                this.bioSampleObj.specimens.filter(obj => {
                  if (obj.commonName == null) {
                    obj.commonName = '-';
                  }
                });
                this.getFiltersForSelectedFilter(this.bioSampleObj.specimens);
              }
              setTimeout(() => {
                this.organismName = data.organism;
                this.dataSourceRecords = new MatTableDataSource<any>(this.bioSampleObj.specimens);
                this.specBioSampleTotalCount = data.results[0]._source.specimens.length;
                this.dataSourceRecords.paginator = this.paginator;
                this.dataSourceRecords.sort = this.sort;
              }, 50);
            },
            err => console.log(err)
        );
  }

  generateSlides(bioSampleObj){
    const output = [];
    const arr = bioSampleObj.images;
    if (arr !== undefined) {
      for (let i = 0; i < arr.length; i++) {
        const obj = {url: encodeURI(arr[i])
              .replace('(', '%28')
              .replace(')', '%29')};
        output.push(obj);
      }
    }

    console.log(output);
    return output;
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
          dataToReturn[key] = '-';
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
    const inactiveClassName = label.toLowerCase().replace(' ', '-') + '-inactive';
    this.createFilterJson(label.toLowerCase().replace(' ', ''), filter);
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
      this.filterJson.sex = value;
    }
    else if (key === 'organismpart') {
      this.filterJson.organismPart = value;
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
    const j = 0;
    for (let i = 0; i < sexFilterObj.length; i++) {
      const jsonObj = { key: sexFilterObj[i][j], doc_count: sexFilterObj[i][j + 1] };
      this.sexFilters.push(jsonObj);
    }
    for (let i = 0; i < orgFilterObj.length; i++) {
      const jsonObj = { key: orgFilterObj[i][j], doc_count: orgFilterObj[i][j + 1] };
      this.organismPartFilters.push(jsonObj);
    }
  }

  removeAllFilters() {
    $('.sex-inactive').removeClass('non-disp');
    $('.org-part-inactive').removeClass('non-disp');
    this.activeFilters = [];
    this.filterJson.sex = '';
    this.filterJson.organismPart = '';
    this.dataSourceRecords.filter = this.filterJson;
    this.getBiosamples();
  }

  removeFilter(filter: string) {
    if (filter !== undefined) {
      const filterIndex = this.activeFilters.indexOf(filter);
      if (this.activeFilters.length !== 0) {
        this.spliceFilterArray(filter);
        this.activeFilters.splice(filterIndex, 1);
        this.dataSourceRecords.filter = this.filterJson;
        this.getFiltersForSelectedFilter(this.dataSourceRecords.filteredData);
      } else {
        this.filterJson.sex = '';
        this.filterJson.organismPart = '';
        this.dataSourceRecords.filter = this.filterJson;
        this.getBiosamples();
      }
    }
  }

  spliceFilterArray(filter: string) {
    if (this.filterJson.sex === filter) {
      this.filterJson.sex = '';
    }
    else if (this.filterJson.organismPart === filter) {
      this.filterJson.organismPart = '';
    }
  }

  // tslint:disable-next-line:typedef
  getFilters(accession) {
          this.filtersMap = this.aggregations.filters;
          this.sexFilters = this.aggregations.filters.sex_filter.buckets;
          this.organismPartFilters = this.aggregations.filters.
              organism_part_filter.buckets;


  }

  getStatusClass(status: string) {
    if (status === 'Annotation Complete') {
      return 'badge badge-pill badge-success';
    } else {
      return 'badge badge-pill badge-warning';
    }
  }

  getSearchResults(from?, size?) {
    $('.sex-inactive').removeClass('non-disp active');
    $('.org-part-inactive').removeClass('non-disp active');
    if (this.searchText.length === 0) {
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
        // tslint:disable-next-line:variable-name
      }) as (PeriodicElement, string) => boolean;
      this.getFiltersForSelectedFilter(this.dataSourceRecords.filteredData);
    }
  }

  toggleCollapse(filterKey) {
    if (filterKey === 'Sex') {
      if (this.isSexFilterCollapsed) {
        this.itemLimitSexFilter = 10000;
        this.isSexFilterCollapsed = false;
      } else {
        this.itemLimitSexFilter = 3;
        this.isSexFilterCollapsed = true;
      }
    }
    else if (filterKey === 'Organism Part') {
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
        this.router.navigate(['/data/root/details/' + accession]));
  }


}
