import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Query, TemplateRef,
  ViewChild
} from '@angular/core';
import {merge, Observable, of as observableOf} from 'rxjs';
import { ActivatedRoute, Router, RouterLink, Params } from '@angular/router';
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

import {MatCard, MatCardActions, MatCardTitle} from '@angular/material/card';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatLine} from '@angular/material/core';
import {MatList, MatListItem} from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';

import { MatInput } from '@angular/material/input';
import {MatAnchor, MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from 'src/app/api.service';
import { DownloadConfirmationDialogComponent } from 'src/app/download-confirmation-dialog-component/download-confirmation-dialog.component';
import { QueryFilter } from 'src/app/shared/query-filter';
import { GenomeNoteListComponent } from '../genome-note-list-component/genome-note-list.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatProgressBar} from '@angular/material/progress-bar';

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
    MatSortHeader,
    MatProgressSpinner,
    MatExpansionModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatError,
    MatProgressBar
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
  queryParams: any = {};
  lastPhylogenyVal = '';
  isPhylogenyFilterProcessing = false; // Flag to prevent double-clicking
  displayErrorMsg = false;
  displayProgressBar = false;

  activeFilters = new Array<string>();
  dataColumnsDefination = [{ name: 'Organism', column: 'organism', selected: true },
    { name: 'ToL ID', column: 'tolid', selected: true },
    { name: 'INSDC ID', column: 'INSDC_ID', selected: true },
    { name: 'Common Name', column: 'commonName', selected: true },
    { name: 'Common Name Source', column: 'commonNameSource', selected: true },
    { name: 'Current Status', column: 'currentStatus', selected: true },
    { name: 'External references', column: 'goatInfo', selected: true },
    { name: 'Submitted to Biosamples', column: 'biosamples', selected: false },
    { name: 'Raw data submitted to ENA', column: 'raw_data', selected: false },
    { name: 'Assemblies submitted to ENA', column: 'assemblies', selected: false },
    { name: 'Annotation complete', column: 'annotation_complete', selected: false },
    { name: 'Annotation submitted to ENA', column: 'annotation', selected: false }];
  displayedColumns = [];
  currentStyle: string;
  currentClass = 'kingdom';
  classes = ['superkingdom', 'kingdom', 'subkingdom', 'superphylum', 'phylum', 'subphylum', 'superclass', 'class',
    'subclass', 'infraclass', 'cohort', 'subcohort', 'superorder', 'order', 'suborder', 'infraorder', 'parvorder',
    'section', 'subsection', 'superfamily', 'family', ' subfamily', ' tribe', 'subtribe', 'genus', 'series', 'subgenus',
    'species_group', 'species_subgroup', 'species', 'subspecies', 'varietas', 'forma'];
  timer: any;
  phylogenyFilters: string[] = [];
  genomelength = 0;
  result: any;
  isCollapsed = true;
  itemLimit = 5;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private activatedRoute = inject(ActivatedRoute);

  downloadDialogTitle = '';
  dialogRef: any;
  public downloadForm!: FormGroup;
  @ViewChild('downloadTemplate') downloadTemplate = {} as TemplateRef<any>;

  constructor(private apiService: ApiService, private dialog: MatDialog, private titleService: Title, private router: Router) {
  }

  ngOnInit(): void {
    this.downloadForm = new FormGroup({
      downloadOption: new FormControl('', [Validators.required]),
    });
    this.getDisplayedColumns();
    this.titleService.setTitle('Data Portal');

    // get url parameters
    const queryParamMap = this.activatedRoute.snapshot['queryParamMap'];
    const params = queryParamMap['params'];
    if (Object.keys(params).length !== 0) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          if (params[key].includes('phylogenyFilters - ')) {
            const phylogenyFilters = params[key].split('phylogenyFilters - ')[1];
            // Remove square brackets and split by comma
            this.phylogenyFilters = phylogenyFilters.slice(1, -1).split(',');
          } else if (params[key].includes('phylogenyCurrentClass - ')) {
            const phylogenyCurrentClass = params[key].split('phylogenyCurrentClass - ')[1];
            this.currentClass = phylogenyCurrentClass;
          } else {
            this.activeFilters.push(params[key]);
          }

        }
      }
    }


  }

  addToActiveFilters(filterArr, filterPrefix) {
    const list = filterArr.split(',');
    list.forEach((value: any) => {
      this.activeFilters.push(filterPrefix + '-' + value);
    });
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

              // get last phylogeny element for filter button
              this.lastPhylogenyVal = this.phylogenyFilters.slice(-1)[0];

              // add filters to URL query parameters
              this.queryParams = [...this.activeFilters];
              if (this.phylogenyFilters && this.phylogenyFilters.length) {
                const index = this.queryParams.findIndex(element => element.includes('phylogenyFilters - '));
                if (index > -1) {
                  this.queryParams[index] = `phylogenyFilters - [${this.phylogenyFilters}]`;
                } else {
                  this.queryParams.push(`phylogenyFilters - [${this.phylogenyFilters}]`);
                }
              }

              this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge',
                replaceUrl: true,
                skipLocationChange: false
              });
              return data.results;
            }),
        )
        .subscribe(data => (this.data = data));
  }


  merge = (first: any[], second: any[], filterLabel: string) => {
    for (const item of second) {
      item.label = filterLabel;
      first.push(item);
    }

    return first;
  }

  getStatusCount(data: any) {
    if (data) {
      for (const item of data) {
        if (item.key === 'Done') {
          return item.doc_count;
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


  onFilterClick(filterValue: string, phylogenyFilter: boolean = false) {
    if (phylogenyFilter) {
      if (this.isPhylogenyFilterProcessing) {
        return;
      }
      // Set flag to prevent further clicks
      this.isPhylogenyFilterProcessing = true;

      this.phylogenyFilters.push(`${this.currentClass}:${filterValue}`);
      const index = this.classes.indexOf(this.currentClass) + 1;
      this.currentClass = this.classes[index];

      // update url with the value of the phylogeny current class
      const queryParamIndex = this.queryParams.findIndex(element => element.includes('phylogenyCurrentClass - '));
      if (queryParamIndex > -1) {
        this.queryParams[queryParamIndex] = `phylogenyCurrentClass - ${this.currentClass}`;
      } else {
        this.queryParams.push(`phylogenyCurrentClass - ${this.currentClass}`);
      }
      // Replace current parameters with new parameters.
      this.replaceUrlQueryParams();
      this.filterChanged.emit();

      // Reset isPhylogenyFilterProcessing flag
      setTimeout(() => {
        this.isPhylogenyFilterProcessing = false;
      }, 500);
    } else{
      clearTimeout(this.timer);
      const index = this.activeFilters.indexOf(filterValue);
      index !== -1 ? this.activeFilters.splice(index, 1) : this.activeFilters.push(filterValue);
      this.filterChanged.emit();
    }
  }

  removePhylogenyFilters() {
    // update url with the value of the phylogeny current class
    const queryParamPhyloIndex = this.queryParams.findIndex(element => element.includes('phylogenyFilters - '));
    if (queryParamPhyloIndex > -1) {
      this.queryParams.splice(queryParamPhyloIndex, 1);
    }

    const queryParamCurrentClassIndex = this.queryParams.findIndex(element => element.includes('phylogenyCurrentClass - '));
    if (queryParamCurrentClassIndex > -1) {
      this.queryParams.splice(queryParamCurrentClassIndex, 1);
    }
    // Replace current url parameters with new parameters.
    this.replaceUrlQueryParams();
    // reset phylogeny variables
    this.phylogenyFilters = [];
    this.currentClass = 'kingdom';
    this.filterChanged.emit();
  }


  replaceUrlQueryParams() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.queryParams,
      replaceUrl: true,
      skipLocationChange: false
    });
  }

  checkStyle(filterValue: string) {
    if (this.activeFilters.includes(filterValue)) {
      return 'background-color: #4BBEFD;';
    } else {
      return '';
    }
  }

  displayActiveFilterName(filterName: string) {
    if (filterName && filterName.startsWith('symbionts_')) {
      return 'Symbionts-' + filterName.split('-')[1];
    }
    if (filterName && filterName.startsWith('experimentType_')) {
      return  filterName.split('_')[1];
    }
    return filterName;
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
    // remove phylogenyFilters param from url
    const index = this.queryParams.findIndex(element => element.includes('phylogenyFilters - '));
    if (index > -1) {
      this.queryParams.splice(index, 1);
      // Replace current parameters with new parameters.
      this.replaceUrlQueryParams();
    }
    this.filterChanged.emit();
  }

  getStyle(status: string) {
    if (['Annotation Complete', 'Done', 'Submitted'].includes(status.trim())) {
      return 'background-color:#8FBc45; --mdc-chip-label-text-color: #fff; --mdc-chip-label-text-size: 10px;';
    }
    else {
      return 'background-color:#ffc107;color: black;--mdc-chip-label-text-size: 10px;';
    }
  }

  getCurrentStatusColour(status: string) {
    if (['Annotation Complete', 'Done', 'Submitted'].includes(status.trim())) {
      return 'background-color:#8FBc45 ; --mdc-chip-label-text-color: #fff;';
    } else {
      return 'background-color:#ffc107;color: black;--mdc-chip-label-text-size: 10px;';
    }
  }

  getCommonNameSourceStyle(source: string) {
    if (source === 'UKSI') {
      return 'background-color:#ffc107; color: #212529; --mdc-chip-label-text-size: 12px;';
    } else {
      return 'background-color:#4BBEFD; --mdc-chip-label-text-color: #fff; --mdc-chip-label-text-size: 11px;';
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
    return data !== undefined && data.tolid !== undefined && data.tolid != null && data.tolid.length > 0 &&
        data.show_tolqc === true;
  }

  checkGenomeExists(data) {
    this.genomelength = data !== undefined && data.genome_notes !== undefined && data.genome_notes != null &&
    data.genome_notes.length ? data.genome_notes.length : 0;
    return data !== undefined && data.genome_notes !== undefined && data.genome_notes != null && data.genome_notes.length;
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
  generateGoatInfoLink(data) {
    if (data.goat_info){
      return data.goat_info.url;
    }


  }
  // tslint:disable-next-line:typedef
  getGenomeURL(data) {
    const genomeNotes = data.genome_notes;
    let genomeNotesURL = '#';
    if (genomeNotes != null && genomeNotes !== undefined) {
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

  onCancelDialog() {
    this.dialogRef.close();
  }

  onDownload() {
    if (this.downloadForm?.valid && this.downloadForm?.touched) {
      this.displayProgressBar = true;
      const downloadOption = this.downloadForm.value['downloadOption'];
      this.downloadFile(downloadOption, true);
    }
    this.displayErrorMsg = true;

  }

  openDownloadDialog(value: string) {
    this.downloadDialogTitle = `Download data`;
    this.dialogRef = this.dialog.open(this.downloadTemplate,
        { data: value, height: '260px', width: '400px' });
  }

  public displayError = (controlName: string, errorName: string) => {
    return this.downloadForm?.controls[controlName].hasError(errorName);
  }

  downloadFile(downloadOption: string, dialog: boolean) {
    this.apiService.downloadData(downloadOption, this.paginator.pageIndex,
        this.paginator.pageSize, this.searchValue || '', this.sort.active, this.sort.direction, this.activeFilters,
        this.currentClass, this.phylogenyFilters, 'data_portal').subscribe({
      next: (response: Blob) => {
        const blobUrl = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'download.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.displayProgressBar = false;
        if (dialog) {
          // close dialog box
          setTimeout(() => {
            this.dialogRef.close();
          }, 500);
        }
      },
      error: error => {
        console.error('Error downloading the CSV file:', error);
      }
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
        activeFilters: this.activeFilters.toString(),
        sort: this.sort,
        taxonomy: { rank: 'superkingdom', taxonomy: 'Eukaryota', childRank: 'kingdom' },
        searchText: this.searchValue,
        selectedOptions: [0, 1, 2],
        hideAnnotation: this.aggregations?.annotation_complete.buckets.length === 0 &&
            this.aggregations?.annotation_complete.buckets.length === 0 ,
        hideAssemblies: this.aggregations?.assemblies_status.buckets.length === 0 ,
        hideRawData: this.aggregations?.raw_data.buckets.length === 0
      }
    });
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
    clearTimeout(this.timer);
    this.activeFilters = [];
    this.phylogenyFilters = [];
    this.currentClass = 'kingdom';
    this.filterChanged.emit();
    this.router.navigate([]);

  }

  checkFilterIsActive = (filter: string) => {
    if (this.activeFilters.indexOf(filter) !== -1) {
      return 'active-filter';
    }

  }


  hasActiveFilters() {
    if (typeof this.activeFilters === 'undefined') {
      return false;
    }
    for (const key of Object.keys(this.activeFilters)) {
      if (this.activeFilters[key].length !== 0) {
        return true;
      }
    }
    return false;
  }

  openGenomeNoteDialog(element: any) {
    const dialogRef = this.dialog.open(GenomeNoteListComponent, {
      width: '550px',
      autoFocus: false,
      data: {
        genomNotes: element.genome_notes,
      }
    });
  }




}
