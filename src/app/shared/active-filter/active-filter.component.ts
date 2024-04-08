import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FilterService} from '../../services/filter-service';

@Component({
  selector: 'app-active-filter',
  templateUrl: './active-filter.component.html',
  styleUrls: ['./active-filter.component.css']
})
export class ActiveFilterComponent {
  aggs = [];
  data = {};
  phylSelectedRank = '';
  constructor(public filterService: FilterService) { }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.aggs = this.filterService.activeFilters;
    this.data = this.filterService.data;
    this.phylSelectedRank = this.filterService.phylSelectedRank;
    this.filterService.field.subscribe(data => {
      this.aggs = this.filterService.activeFilters;
      this.data = this.filterService.data;
    });
  }

  // tslint:disable-next-line:typedef
  clearFilter(filter: string) {
    if (filter !== undefined) {
      this.filterService.updateDomForRemovedFilter(filter);
      const filterIndex = this.filterService.activeFilters.indexOf(filter);
      this.filterService.activeFilters.splice(filterIndex, 1);
      this.filterService.isFilterSelected = false;
      this.filterService.updateActiveRouteParams();

    }
  }

  // tslint:disable-next-line:typedef
  displayActiveFilterName(filterName: string){
    if (filterName.includes('symbiontsBioSamplesStatus-')){
      return filterName.replace(/^symbiontsBioSamplesStatus-/, 'Symbionts-');
    }
    if (filterName.includes('symbiontsRawDataStatus-')){
      return filterName.replace(/^symbiontsRawDataStatus-/, 'Symbionts-');
    }
    if (filterName.includes('symbiontsAssembliesStatus-')){
      return filterName.replace(/^symbiontsAssembliesStatus-/, 'Symbionts-');
    }
    if (filterName.includes('experimentType-')){
      return filterName.replace(/^experimentType-/, '');
    }
    return filterName;
  }

}
