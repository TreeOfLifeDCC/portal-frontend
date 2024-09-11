import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {merge, of as observableOf} from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow, MatRow, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import { Title } from '@angular/platform-browser';
import { DashboardService } from '../services/dashboard.service';
import {NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';



import 'jquery';
import 'bootstrap';

import {MatDialog} from '@angular/material/dialog';

import {
  catchError,
  debounceTime,
  distinctUntilChanged, map,
  startWith,
  switchMap
} from 'rxjs/operators';

import {MatCard, MatCardActions, MatCardTitle} from "@angular/material/card";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {MatLine} from "@angular/material/core";
import {MatList, MatListItem} from "@angular/material/list";
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatFormField, MatLabel } from '@angular/material/form-field';
import { NgForOf, NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import {MatAnchor, MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [

    MatCard,
    MatCardTitle,
    MatCardActions,
    MatList,
    MatListItem,
    MatChipSet,
    MatLine,
    MatChip,
    MatIcon,
    MatProgressSpinner,
    MatLabel,
    MatFormField,
    MatTable,
    MatSort,
    MatHeaderCellDef,
    RouterLink,
    MatHeaderCell,
    MatCell,
    MatAnchor,
    MatColumnDef,
    MatPaginator,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
    MatCellDef,
    MatButton,
    MatInput,
    NgIf,
    NgForOf,
    MatSortHeader,
    MatProgressSpinner,
    MatExpansionModule,
    MatCheckboxModule,
  

  ],
  standalone: true
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
  symbiontsFilters: any[] = [];
  experimentTypeFilters: any[] = [];
  // displayedColumns: string[] = ['organism', 'commonName', 'commonNameSource', 'currentStatus', 'goatInfo'];
  data: any;
  searchValue: string;
  searchChanged = new EventEmitter<any>();
  filterChanged = new EventEmitter<any>();
  columnschangedChanged = new EventEmitter<any>();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  aggregations: any;

  activeFilters = new Array<string>();
  dataColumnsDefination = [{ name: 'Organism', column: 'organism', selected: true }, { name: 'ToL ID', column: 'tolid', selected: true }, { name: 'INSDC ID', column: 'INSDC_ID', selected: true }, { name: 'Common Name', column: 'commonName', selected: true }, { name: 'Common Name Source', column: 'commonNameSource', selected: true }, { name: 'Current Status', column: 'currentStatus', selected: true }, { name: 'External references', column: 'goatInfo', selected: true }, { name: 'Submitted to Biosamples', column: 'biosamples', selected: false }, { name: 'Raw data submitted to ENA', column: 'raw_data', selected: false },  { name: 'Assemblies submitted to ENA', column: 'assemblies', selected: false }, { name: 'Annotation complete', column: 'annotation_complete', selected: false }, { name: 'Annotation submitted to ENA', column: 'annotation', selected: false }];
  displayedColumns = [];
  currentStyle: string;
  currentClass = 'kingdom';
  classes = ['superkingdom', 'kingdom', 'subkingdom', 'superphylum', 'phylum', 'subphylum', 'superclass', 'class',
    'subclass', 'infraclass', 'cohort', 'subcohort', 'superorder', 'order', 'suborder', 'infraorder', 'parvorder',
    'section', 'subsection', 'superfamily', 'family', ' subfamily', ' tribe', 'subtribe', 'genus', 'series', 'subgenus',
    'species_group', 'species_subgroup', 'species', 'subspecies', 'varietas', 'forma'];
  timer: any;
  phylogenyFilters: string[] = [];

  preventSimpleClick = false;
  genomelength = 0;
  result: any;
  isCollapsed = true;
  itemLimit = 5;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService, private dialog: MatDialog, private titleService: Title) {
  }

  ngOnInit(): void {
    this.getDisplayedColumns();
    this.titleService.setTitle('Data Portal');
  }

  ngAfterViewInit() {
    // If the user changes the metadataSort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.searchChanged.subscribe(() => (this.paginator.pageIndex = 0));
    this.filterChanged.subscribe(() => (this.paginator.pageIndex = 0));
    this.columnschangedChanged.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page, this.sort.sortChange, this.searchChanged, this.filterChanged, this.columnschangedChanged)
        .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              return this.apiService.getData(this.paginator.pageIndex,
                  this.paginator.pageSize, this.searchValue, this.sort.active, this.sort.direction, this.activeFilters,
                  this.currentClass, this.phylogenyFilters, 'data_portal'
              ).pipe(catchError(() => observableOf(null)));
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;
              this.isRateLimitReached = data === null;

              if (data === null) {
                return [];
              }

              // Only refresh the result length if there is new metadataData. In case of rate
              // limit errors, we do not want to reset the metadataPaginator to zero, as that
              // would prevent users from re-triggering requests.
              this.resultsLength = data.count;
              this.aggregations = data.aggregations;

              // symbionts
              this.symbiontsFilters = [];
              if (this.aggregations.symbionts_biosamples_status.buckets.length > 0) {
                this.symbiontsFilters = this.merge(this.symbiontsFilters,
                    this.aggregations.symbionts_biosamples_status.buckets,
                    'symbionts_biosamples_status');
              }
              if (this.aggregations.symbionts_raw_data_status.buckets.length > 0) {
                this.symbiontsFilters = this.merge(this.symbiontsFilters,
                    this.aggregations.symbionts_raw_data_status.buckets,
                    'symbionts_raw_data_status');
              }
              if (this.aggregations.symbionts_assemblies_status.buckets.length > 0) {
                this.symbiontsFilters = this.merge(this.symbiontsFilters,
                    this.aggregations.symbionts_assemblies_status.buckets,
                    'symbionts_assemblies_status');
              }

              this.experimentTypeFilters = [];
              if (this.aggregations?.experiment.library_construction_protocol.buckets.length > 0) {
                this.experimentTypeFilters = this.merge(this.experimentTypeFilters,
                  this.aggregations?.experiment.library_construction_protocol.buckets,
                    'experimentType');
              }
              // this.result = new MatTableDataSource(data.result);
              // this.result.paginator= this.paginator;
              // this.data=this.result
              return data.results;
            }),
        )
        .subscribe(data => (this.data = data));
  }


  merge = (first: any[], second: any[], filterLabel: string) => {
    for (let i = 0; i < second.length; i++) {
      second[i].label = filterLabel;
      first.push(second[i]);
    }
    return first;
  }

  getStatusCount(data: any) {
    if (data) {
      for (let i = 0; i < data.length; ++i) {
        if (data[i].key === 'Done') {
          return data[i].doc_count;
        }
      }
    }
  }

  convertProjectName(data: string) {
    if (data === 'dtol') {
      return 'DToL';
    } else {
      return data;
    }
  }

  applyFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.searchChanged.emit();
  }


  onFilterClick(filterValue: string) {
    this.preventSimpleClick = true;
    clearTimeout(this.timer);
    const index = this.activeFilters.indexOf(filterValue);
    index !== -1 ? this.activeFilters.splice(index, 1) : this.activeFilters.push(filterValue);
    this.filterChanged.emit();
  }

  checkStyle(filterValue: string) {
    if (this.activeFilters.includes(filterValue)) {
      return 'background-color: #4BBEFD;';
    } else {
      return '';
    }
  }

  displayActiveFilterName(filterName: string) {
    if (filterName.startsWith('symbionts_')) {
      return 'Symbionts-' + filterName.split('-')[1];
    }
    if (filterName.startsWith('experimentType_')) {
      return  filterName.split('_')[1];
    }
    return filterName;
  }

  changeCurrentClass(filterValue: string) {
    console.log('single click');
    const delay = 200;
    this.preventSimpleClick = false;
    this.timer = setTimeout(() => {
      if (!this.preventSimpleClick) {
        this.phylogenyFilters.push(`${this.currentClass}:${filterValue}`);
        const index = this.classes.indexOf(this.currentClass) + 1;
        this.currentClass = this.classes[index];
        console.log(this.phylogenyFilters);
        this.filterChanged.emit();
      }
    }, delay);
  }

  onHistoryClick() {
    this.phylogenyFilters.splice(this.phylogenyFilters.length - 1, 1);
    const previousClassIndex = this.classes.indexOf(this.currentClass) - 1;
    this.currentClass = this.classes[previousClassIndex];
    this.filterChanged.emit();
  }

  onRefreshClick() {
    this.phylogenyFilters = [];
    this.currentClass = 'kingdom';
    this.filterChanged.emit();
  }

  getStyle(status: string) {
    if (['Annotation Complete', 'Done', 'Submitted'].includes(status.trim())) {
      return "background-color:#8FBc45; --mdc-chip-label-text-color: #fff; --mdc-chip-label-text-size: 10px;";
    }
    else {
      return "background-color:#ffc107;color: black;--mdc-chip-label-text-size: 10px;";
    }
  }

  getCurrentStatusColour(status: string) {
    console.log(status);
    if (['Annotation Complete', 'Done', 'Submitted'].includes(status.trim())) {
      return 'background-color:#8FBc45 ; --mdc-chip-label-text-color: #fff;'
    } else {
      return 'background-color:#ffc107;color: black;--mdc-chip-label-text-size: 10px;';
    }
  }

  getCommonNameSourceStyle(source: string) {
    if (source === 'UKSI') {
      return "background-color:#ffc107; color: #212529; --mdc-chip-label-text-size: 12px;";
    } else {
      return "background-color:#4BBEFD; --mdc-chip-label-text-color: #fff; --mdc-chip-label-text-size: 11px;"
    }
  }

  getCommonNameSourceColour(element: any) {
    if (element.commonNameSource === 'UKSI') {
      return ['#ffc107', 'common_name_source_uksi'];
    } else {
      return ['#4BBEFD', 'common_name_source_other'];
    }
  }
  checkGenomeNotes(data: any) {
    if (data.genome_notes && data.genome_notes.length !== 0) {
      this.genomelength = data.genome_notes.length;
      return true;
    } else {
      return false;
    }
  }

  checkTolidExists(data) {
    return data != undefined && data.tolid != undefined && data.tolid != null && data.tolid.length > 0 &&
        data.show_tolqc === true;
  }
  // tslint:disable-next-line:typedef
  checkGenomeExists(data) {
    this.genomelength = data != undefined && data.genome_notes != undefined && data.genome_notes != null && data.genome_notes.length ? data.genome_notes.length :0;
    return data != undefined && data.genome_notes != undefined && data.genome_notes != null && data.genome_notes.length;
  }

  checkNbnAtlasExists(data): boolean {
    return data !== undefined && data.nbnatlas !== undefined && data.nbnatlas !== null;
  }
  // tslint:disable-next-line:typedef
  generateTolidLink(data) {
    const organismName = data.organism.split(' ').join('_');
    if (typeof(data.tolid) === 'string'){
      const clade = this.codes[data.tolid.charAt(0)];
      return `https://tolqc.cog.sanger.ac.uk/darwin/${clade}/${organismName}`;

    }else {
      if (data.tolid.length > 0) {
        const clade = this.codes[data.tolid[0].charAt(0)];
        return `https://tolqc.cog.sanger.ac.uk/darwin/${clade}/${organismName}`;
      }
    }
  }
  // tslint:disable-next-line:typedef
  getGenomeURL(data) {
    const genomeNotes = data.genome_notes;
    let genomeNotesURL = '#';
    if (genomeNotes != null && genomeNotes != undefined) {
      genomeNotesURL = genomeNotes[0].url;
    }
    return genomeNotesURL;
  }

  // openGenomeNoteDialog(data: any) {
  //   const dialogRef = this.dialog.open(GenomeNoteListComponent, {
  //     width: '550px',
  //     autoFocus: false,
  //     data: {
  //       genomNotes: data.genome_notes,
  //     }
  //   });
  // }

  downloadFile(format: string) {
    this.apiService.downloadRecords(this.paginator.pageIndex,
        this.paginator.pageSize, this.searchValue, this.sort.active, this.sort.direction, this.activeFilters,
        this.currentClass, this.phylogenyFilters, 'data_portal').subscribe((res: Blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(res);
      a.download = 'data_portal.' + format;
      a.click();
    });
  }

  toggleCollapse = () => {
    if (this.isCollapsed) {
      this.itemLimit = 10000;
      this.isCollapsed = false;
    } else {
      this.itemLimit = 5;
      this.isCollapsed = true;
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(DownloadConfirmationDialogComponent, {
      width: '550px',
      autoFocus: false,
      data: {
        message: 'Are you sure want to donload?',
        name: this.filterService.selectedFilterValue.taxonomy,
        activeFilters: this.filterService.activeFilters.toString(),
        sort: this.sort,
        taxonomy: { rank: 'superkingdom', taxonomy: 'Eukaryota', childRank: 'kingdom' },
        searchText: this.filterService.searchText,
        selectedOptions: [0, 1, 2],
        hideAnnotation: this.filterService.AnnotationFilters.length === 0 && this.filterService.AnnotationCompleteFilters.length === 0 ,
        hideAssemblies: this.filterService.AssembliesFilters.length === 0 ,
        hideRawData: this.filterService.RawDataFilters.length === 0
      }
    }

  expanded() {
  }
  getDisplayedColumns() {
    this.displayedColumns = [];
    this.dataColumnsDefination.forEach(obj => {
      if (obj.selected) {
        this.displayedColumns.push(obj.column);
      }
    });
  }
  showSelectedColumn(selectedColumn, checked) {
    const index = this.dataColumnsDefination.indexOf(selectedColumn);
    const item = this.dataColumnsDefination[index];
    item.selected = checked;
    this.dataColumnsDefination[index] = item;
    this.getDisplayedColumns();
    this.columnschangedChanged.emit();

  }

  typeofTol(tolid: any) {
    if (typeof(tolid) === 'string'){
      return tolid;
    }else{
      return tolid.join(', ');
    }
  }

  getINSDC_ID(row: any) {
    const exp = row._source.experiment;
    if (exp !== undefined && exp.length > 0) {
      return exp[0].study_accession;
    } else {
      return null;
    }

  }

  removeFilter() {
    this.preventSimpleClick = true;
    clearTimeout(this.timer);
    this.activeFilters= [];
    this.filterChanged.emit();
  
  }

  checkFilterIsActive = (filter: string) => {
    // console.log(this.filterService.activeFilters);
    if (this.activeFilters.indexOf(filter) !== -1) {
      return 'active-filter';
    }

  }
}
