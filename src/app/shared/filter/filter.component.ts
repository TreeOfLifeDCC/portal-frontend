import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {FilterService} from '../../services/filter-service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, AfterViewInit {
  @Input() title: string;

  @Input() filterSize: number;

  isCollapsed = true;
  itemLimit = 5;


  constructor(public filterService: FilterService
            ) { }

  ngOnInit(): void {
    this.itemLimit = this.filterSize;
  }

  checkFilterIsActive = (filter: string) => {
    // console.log(this.filterService.activeFilters);
    if (this.filterService.activeFilters.indexOf(filter) !== -1) {
      return 'active-filter';
    }

  }

  onFilterClick = (event, label: string, filter: string) => {
    const filterIndex = this.filterService.activeFilters.indexOf(filter);
    if (filterIndex !== -1) {
      this.removeFilter(filter);
    } else {
      this.filterService.selectedFilterArray(label, filter);
      this.filterService.activeFilters.push(filter);
      this.filterService.updateActiveRouteParams();

      }
    }
  removeFilter(filter: string) {
    if (filter !== undefined) {

      this.filterService.updateDomForRemovedFilter(filter);
      const filterIndex = this.filterService.activeFilters.indexOf(filter);
      this.filterService.activeFilters.splice(filterIndex, 1);
      this.filterService.isFilterSelected = false;
      this.filterService.updateActiveRouteParams();

    }
  }
  getStatusClass = (status: string) => {
    if (status === 'Annotation Complete') {
      return 'badge badge-pill badge-success';
    }
    else if (status === 'Done') {
      return 'badge badge-pill badge-success';
    }
    else if (status === 'Waiting') {
      return 'badge badge-pill badge-warning';
    }
    else if (status === 'Submitted') {
      return 'badge badge-pill badge-success';
    }
    else {
      return 'badge badge-pill badge-warning';
    }
  }

  toggleCollapse = () => {
    if (this.isCollapsed) {
      this.itemLimit = 10000;
      this.isCollapsed = false;
    } else {
      this.itemLimit = this.filterSize;
      this.isCollapsed = true;
    }
  }

  ngAfterViewInit(): void {
  }


}
