import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sample, samples } from '../dashboard/model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../dashboard/services/dashboard.service';
import {ApiService} from '../api.service';
import {ImageSliderComponent} from '../image-slider/image-slider.component';


@Component({
  selector: 'app-specimens',
  templateUrl: './specimens.component.html',
  styleUrls: ['./specimens.component.css'],
  imports: [
    ImageSliderComponent
  ],
  standalone: true
})
export class SpecimenDetailsComponent implements OnInit {

  bioSampleId;
  bioSampleObj;

  slides: any[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSourceRecords;
  specBioSampleTotalCount;
  specDisplayedColumns = ['accession', 'organism', 'commonName', 'sex', 'organismPart', 'trackingSystem'];


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

  lat;
  lng;
  geoLocation: Boolean = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {
    this.route.params.subscribe(param => this.bioSampleId = param.specimenId);
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
    this.apiService.getSpecimenByAccession(this.bioSampleId)
      .subscribe(
        data => {
          this.bioSampleObj = data.results[0]._source;;
          this.slides = this.generateSlides(this.bioSampleObj);
          this.organismName = this.bioSampleObj.organism;
          this.lat = this.bioSampleObj.geographicLocationLatitude?.text;
          this.lng = this.bioSampleObj.geographicLocationLongitude?.text;
          if (this.lat != 'not collected' && this.lat != 'not provided') {
            this.geoLocation = true;
          }
          else {
            this.geoLocation = false;
          }
        },
        err => console.log(err)
      );
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
          dataToReturn[key] = '-'
        }
        else {
          dataToReturn[key] = data[key];
        }
      }
    }
    return dataToReturn;
  }

  generateSlides(bioSampleObj){
    const output = [];
    const arr = bioSampleObj.images;
    for (let i = 0; i < arr.length; i++) {
      const obj = {url: encodeURI(arr[i])
            .replace('(', '%28')
            .replace(')', '%29')};
      output.push(obj);
    }
    console.log(output);
    return output;
  }

}

