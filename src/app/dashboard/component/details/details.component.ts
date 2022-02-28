import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sample, samples } from '../../model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  organismName;
  relatedRecords;
  specFilterJson = {
    sex: "",
    organismPart: "",
  };

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private router: Router) {
    this.route.params.subscribe(param => this.bioSampleId = param.id);
  }

  ngOnInit(): void {
    this.specActiveFilters = [];
    this.specfilterSize = 3;
    this.specitemLimitSexFilter = this.specfilterSize;
    this.specitemLimitOrgFilter = this.specfilterSize;
    this.relatedRecords = [];
    this.specFilterJson['sex'] = '';
    this.specFilterJson['organismPart'] = '';
    this.getBiosamples();
  }

  // tslint:disable-next-line:typedef
  getBiosamples() {
    this.dashboardService.getBiosampleByAccession(this.bioSampleId)
      .subscribe(
        data => {
          const specUnpackedData = [];
          for (const item of data.hits.hits) {
            specUnpackedData.push(this.unpackData(item));
          }
          this.bioSampleObj = specUnpackedData[0];
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
            this.dataSourceSpecRecords = new MatTableDataSource<any>(this.bioSampleObj.specimens);
            this.specBioSampleTotalCount = specUnpackedData?.length;
            this.dataSourceSpecRecords.paginator = this.paginator;
            this.dataSourceSpecRecords.sort = this.sort;
          }, 50);
        },
        err => console.log(err)
      );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSpecRecords.filter = filterValue.trim().toLowerCase();
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
    if (this.specActiveFilters.indexOf(filter) !== -1) {
      return 'active';
    }

  }

  onFilterClick(event, label: string, filter: string) {
    this.specSearchText = '';
    let inactiveClassName = label.toLowerCase().replace(" ", "-") + '-inactive';
    this.createspecFilterJson(label.toLowerCase().replace(" ", ""), filter);
    const filterIndex = this.specActiveFilters.indexOf(filter);

    if (filterIndex !== -1) {
      $('.' + inactiveClassName).removeClass('non-disp');
      this.removeFilter(filter);
    } else {
      this.specActiveFilters.push(filter);
      this.dataSourceSpecRecords.filter = this.specFilterJson;
      this.getFiltersForSelectedFilter(this.dataSourceSpecRecords.filteredData);
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

  getFiltersForSelectedFilter(data: any) {
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

  removeAllFilters() {
    $('.sex-inactive').removeClass('non-disp');
    $('.org-part-inactive').removeClass('non-disp');
    this.specActiveFilters = [];
    this.specFilterJson['sex'] = '';
    this.specFilterJson['organismPart'] = '';
    this.dataSourceSpecRecords.filter = this.specFilterJson;
    this.getBiosamples();
  }

  removeFilter(filter: string) {
    if (filter != undefined) {
      const filterIndex = this.specActiveFilters.indexOf(filter);
      if (this.specActiveFilters.length !== 0) {
        this.spliceFilterArray(filter);
        this.specActiveFilters.splice(filterIndex, 1);
        this.dataSourceSpecRecords.filter = this.specFilterJson;
        this.getFiltersForSelectedFilter(this.dataSourceSpecRecords.filteredData);
      } else {
        this.specFilterJson['sex'] = '';
        this.specFilterJson['organismPart'] = '';
        this.dataSourceSpecRecords.filter = this.specFilterJson;
        this.getBiosamples();
      }
    }
  }

  spliceFilterArray(filter: string) {
    if (this.specFilterJson['sex'] === filter) {
      this.specFilterJson['sex'] = '';
    }
    else if (this.specFilterJson['organismPart'] === filter) {
      this.specFilterJson['organismPart'] = '';
    }
  }

  // tslint:disable-next-line:typedef
  getFilters(accession) {
    this.dashboardService.getSpecimenFilters(accession).subscribe(
      data => {
        this.specFiltersMap = data;
        this.specSexFilters = this.specFiltersMap.sex.filter(i => i !== "");
        this.specOrganismPartFilters = this.specFiltersMap.organismPart.filter(i => i !== "");
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
    if (this.specSearchText.length == 0) {
      this.getBiosamples();
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
      this.getFiltersForSelectedFilter(this.dataSourceSpecRecords.filteredData);
    }
  }

  toggleCollapse(filterKey) {
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

  redirectTo(accession: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/data/root/details/" + accession]));
  }

}
