import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {DashboardService} from "../services/dashboard.service";
import {Taxonomy} from "../../taxanomy/taxonomy.model";
import {Sample} from "../model/dashboard.model";
import {MatTableDataSource} from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {TaxanomyService} from "../../taxanomy/taxanomy.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FilterService} from "../../shared/filter-service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, AfterViewInit {
  @Input() title: string;

  filterSize: number;
  urlAppendFilterArray = this.filterService.urlAppendFilterArray;
  searchText = '';


  activeFilters = this.filterService.activeFilters;
  filtersMap;
  filters = {
    sex: {},
    trackingSystem: {}
  };



  BiosamplesFilters = [];
  RawDataFilters = [];
  MappedReadsFilters = [];
  AssembliesFilters = [];
  AnnotationFilters = [];
  AnnotationCompleteFilters = [];
  GenomeFilters = [];
  experimentTypeFilters = [];
  isCollapsed = true;
  itemLimit = 5;

  constructor(private titleService: Title, private dashboardService: DashboardService, private filterService: FilterService,
              private activatedRoute: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService
            ) { }

  ngOnInit(): void {
    this.getFilters();
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
      else if (ena_filters[0] === 'Genome Notes') {
        return data.genome === ena_filters[1];
      }
    }
  }



  // tslint:disable-next-line:typedef
  checkFilterIsActive(filter: string) {
    if (this.activeFilters.indexOf(filter) !== -1) {
      return 'active-filter';
    }

  }

  // tslint:disable-next-line:typedef
  onFilterClick(event, label: string, filter: string) {
    const filterIndex = this.activeFilters.indexOf(filter);
    this.activeFilters.push(filter);
    // this.dataSource.filter = `${filter.trim().toLowerCase()}|${label}`;
    // this.getFilterResults(this.activeFilters.toString(), this.sort.active, this.sort.direction, 0, this.pagesize, taxonomy);
    // this.updateActiveRouteParams();
    this.filterService.field.next(this.filterService.activeFilters);

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
          this.GenomeFilters = this.filtersMap.genome.filter(i => i !== '');
        },
        err => console.log(err)
    );
    this.dashboardService.getExperimentTypeFilters().subscribe(
        data => {
          this.experimentTypeFilters = data.Experiment_type.filter(i => i !== '');
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
    else if (status == 'Submitted') {
      return 'badge badge-pill badge-success';
    }
    else {
      return 'badge badge-pill badge-warning';
    }
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
    const genome = this.filtersMap.aggregations.genome.doc_count;
    this.GenomeFilters = [{ key: 'Genome Notes - Submitted', doc_count: genome }];
    const experiement = this.filtersMap.aggregations.experiment.library_construction_protocol.buckets;
    this.experimentTypeFilters = experiement;
  }

  toggleCollapse() {
    if (this.isCollapsed) {
      this.itemLimit = 10000;
      this.isCollapsed = false;
    } else {
      this.itemLimit = this.filterSize;
      this.isCollapsed = true;
    }
  }

  // getReverseHumanName(data) {
  //   return reverseProtocolNames[data];
  // }

}
