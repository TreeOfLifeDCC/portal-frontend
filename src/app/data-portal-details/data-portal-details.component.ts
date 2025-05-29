import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Sample} from '../dashboard/model/dashboard.model';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from '@angular/material/table';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import {DomSanitizer, SafeResourceUrl, SafeHtml} from '@angular/platform-browser';
import {ApiService} from '../api.service';
import {MatTab, MatTabContent, MatTabGroup} from '@angular/material/tabs';
import {MatCard, MatCardActions, MatCardTitle} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {JsonPipe, NgClass, NgOptimizedImage, NgStyle} from '@angular/common';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatList, MatListItem} from '@angular/material/list';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {MatLine} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {FormsModule} from '@angular/forms';
import {MapClusterComponent} from '../dashboard/map-cluster/map-cluster.component';
import {TABLE_CONFIG} from './table-config';

@Component({
    selector: 'dashboard-data-portal-organism-details',
    templateUrl: './data-portal-details.component.html',
    styleUrls: ['./data-portal-details.component.css'],
    standalone: true,
    imports: [
        MatTabGroup,
        MatTab,
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
        NgxSpinnerModule,
        MatExpansionModule,
        MatCheckboxModule,
        NgStyle,
        NgClass,
        FormsModule,
        MapClusterComponent,
        NgOptimizedImage,
        MatTabContent,
        JsonPipe
    ]
})
export class DataPortalDetailsComponent implements OnInit, AfterViewInit {
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
    bioSampleId: string;
    bioSampleObj;
    aggregations;
    dataSourceRecords;
    dataSourceSymbiontsRecords;
    dataSourceMetagenomesRecords;
    dataSourceMetagenomesAssemblies;
    dataSourceMetagenomesAssembliesCount;
    specBioSampleTotalCount;
    specSymbiontsTotalCount;
    searchMetagenomesText;
    specDisplayedColumns = ['accession', 'organism', 'commonName', 'sex', 'organismPart', 'trackingSystem'];
    private ENA_PORTAL_API_BASE_URL_FASTA = 'https://www.ebi.ac.uk/ena/browser/api/fasta/';
    searchText = '';
    searchSymbiontsText = '';
    activeFilters = [];
    filters = {
        sex: {},
        trackingSystem: {},
        organismPart: {}
    };

    showAllFilters = {
        metadataTab: {
            sex: false,
            organismPart: false,
            trackingSystem: false,
        },
        symbiontsTab: {
            sex: false,
            organismPart: false,
            trackingSystem: false,
        },
        metagenomesTab : {
            sex: {},
            trackingSystem: {},
            organismPart: {}
        }
    };

    metadataSexFilters = [];
    metadataTrackingSystemFilters = [];
    metadataOrganismPartFilters = [];

    symbiontsSexFilters = [];
    symbiontsTrackingSystemFilters = [];
    symbiontsOrganismPartFilters = [];

    metagenomesSexFilters = [];
    metagenomesTrackingSystemFilters = [];
    metagenomesOrganismPartFilters = [];

    organismName;
    relatedRecords;
    filterJson = {
        sex: '',
        organismPart: '',
        trackingSystem: '',
        search: ''
    };
    popupImage: string | null = null;
    dataSourceFiles;
    dataSourceFilesCount;
    dataSourceAssemblies;
    dataSourceAssembliesCount;
    dataSourceSymbiontsAssemblies;
    dataSourceSymbiontsAssembliesCount;
    dataSourceAnnotation;
    dataSourceAnnotationCount;
    dataSourceRelatedAnnotation;
    dataSourceRelatedAnnotationCount;
    dataSourceMetagenomesRecordsCount;

    experimentColumnsDefination = [{column: 'study_accession', selected: true},
        {column: 'secondary_study_accession', selected: false},
        {column: 'sample_accession', selected: true}, {column: 'secondary_sample_accession', selected: false},
        {column: 'experiment_accession', selected: true}, {column: 'run_accession', selected: true},
        {column: 'submission_accession', selected: false}, {column: 'tax_id', selected: true},
        {column: 'scientific_name', selected: true}, {column: 'instrument_platform', selected: false},
        {column: 'instrument_model', selected: false}, {column: 'library_name', selected: false},
        {column: 'nominal_length', selected: false}, {column: 'library_layout', selected: false},
        {column: 'library_strategy', selected: false}, {column: 'library_source', selected: false},
        {column: 'library_selection', selected: false}, {column: 'read_count', selected: false},
        {column: 'base_count', selected: false}, {column: 'center_name', selected: false},
        {column: 'first_public', selected: false}, {column: 'last_updated', selected: false},
        {column: 'experiment_title', selected: false}, {column: 'study_title', selected: false},
        {column: 'study_alias', selected: false}, {column: 'experiment_alias', selected: false},
        {column: 'run_alias', selected: false}, {column: 'fastq_bytes', selected: false},
        {column: 'fastq_md5', selected: false}, {column: 'fastq_ftp', selected: true},
        {column: 'fastq_aspera', selected: false}, {column: 'fastq_galaxy', selected: false},
        {column: 'submitted_bytes', selected: false}, {column: 'submitted_md5', selected: false},
        {column: 'submitted_ftp', selected: true}, {column: 'submitted_aspera', selected: false},
        {column: 'submitted_galaxy', selected: false}, {column: 'submitted_format', selected: false},
        {column: 'sra_bytes', selected: false}, {column: 'sra_md5', selected: false},
        {column: 'sra_ftp', selected: true}, {column: 'sra_aspera', selected: false},
        {column: 'sra_galaxy', selected: false}, {column: 'cram_index_ftp', selected: false},
        {column: 'cram_index_aspera', selected: false}, {column: 'cram_index_galaxy', selected: false},
        {column: 'sample_alias', selected: false}, {column: 'broker_name', selected: false},
        {column: 'sample_title', selected: false}, {column: 'nominal_sdev', selected: false},
        {column: 'first_created', selected: false}, {column: 'library_construction_protocol', selected: true}];

    displayedColumnsFiles = [];
    displayedColumnsAnnotations = [];
    displayedColumnsAssemblies = ['accession', 'assembly_name', 'description', 'version'];
    displayedColumnsAnnotation = ['accession', 'annotation', 'proteins', 'transcripts',
        'softmasked_genome', 'other_data', 'view_in_browser'];
    displayedColumnsRelatedAnnotation = [
        {name: 'Study Accession', column: 'study_accession', selected: true},
        {name: 'Sample Accession', column: 'sample_accession', selected: true},
        {name: 'Secondary Sample Accession', column: 'secondary_sample_accession', selected: true},
        {name: 'Tax Id', column: 'tax_id', selected: true},
        {name: 'Study Alias', column: 'study_alias', selected: true},
        {name: 'Submitted files: FTP', column: 'submitted_ftp', selected: true},
        {name: 'Submitted files: Aspera', column: 'submitted_aspera', selected: true},
        {name: 'Broker Name', column: 'broker_name', selected: true},
        {name: 'Analysis Accession', column: 'analysis_accession', selected: false},
        {name: 'Anaylsis Type', column: 'analysis_type', selected: false},
        {name: 'Center Name', column: 'center_name', selected: false},
        {name: 'Generated Bytes', column: 'generated_bytes', selected: false},
        {name: 'Generated MD5', column: 'generated_md5', selected: false},
        {name: 'Sample Alias', column: 'sample_alias', selected: false},
        {name: 'Submitted Bytes', column: 'submitted_bytes', selected: false},
        {name: 'Submitted MD5', column: 'submitted_md5', selected: false},
        {name: 'Anaylsis Alias', column: 'analysis_alias', selected: false},
        {name: 'Assembly Type', column: 'assembly_type', selected: false},
        {name: 'First Public', column: 'first_public', selected: false},
        {name: 'Generated FTP', column: 'generated_ftp', selected: false},
        {name: 'Last Updated', column: 'last_updated', selected: false},
        {name: 'Sample Title', column: 'sample_title', selected: false},
        {name: 'Study Title', column: 'study_title', selected: false},
        {name: 'Analysis Title', column: 'analysis_title', selected: false},
        {name: 'Generated Aspera', column: 'generated_aspera', selected: false},
        {name: 'Generated Galaxy', column: 'generated_galaxy', selected: false}
    ];

    genomeNotes = [];
    INSDC_ID = null;
    assembliesurls = [];
    annotationsurls = [];
    dataSourceGoatInfo;
    @Input() loader = '../../assets/200.gif';
    @Input() height = 200;
    @Input() width = 200;
    @Input() image: string;
    dataDownloaded: any = [];
    isLoading: boolean;
    displayedColumnsGoatInfo = ['name', 'value', 'count', 'aggregation_method', 'aggregation_source'];

    @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
    @ViewChild(MatSort) sort: MatSort | undefined;


    @ViewChild('paginatorOrganisms') paginatorOrganisms!: MatPaginator;
    @ViewChild('sortOrganisms') sortOrganisms!: MatSort;

    @ViewChild('paginatorAnnotation') paginatorAnnotation!: MatPaginator;
    @ViewChild('sortAnnotation') sortAnnotation!: MatSort;

    @ViewChild('paginatorAnnotationSection') paginatorAnnotationSection!: MatPaginator;
    @ViewChild('sortAnnotationSection') sortAnnotationSection!: MatSort;

    @ViewChild('paginatorAssemblies') paginatorAssemblies!: MatPaginator;
    @ViewChild('sortAssemblies') sortAssemblies!: MatSort;

    @ViewChild('paginatorFiles') paginatorFiles!: MatPaginator;
    @ViewChild('sortFiles') sortFiles!: MatSort;

    @ViewChild('paginatorSymbionts') paginatorSymbionts!: MatPaginator;
    @ViewChild('sortSymbionts') sortSymbionts!: MatSort;

    @ViewChild('paginatorSymbiontsAssemblies') paginatorSymbiontsAssemblies!: MatPaginator;
    @ViewChild('sortSymbiontsAssemblies') sortSymbiontsAssemblies!: MatSort;


    @ViewChild('paginatorMetagenomes') paginatorMetagenomes!: MatPaginator;
    @ViewChild('sortMetagenomes') sortMetagenomes!: MatSort;

    @ViewChild('paginatorMetagenomesAssemblies') paginatorMetagenomesAssemblies!: MatPaginator;
    @ViewChild('sortMetagenomesAssemblies') sortMetagenomesAssemblies!: MatSort;

    isCollapsed: { [key: string]: boolean } = {};
    geoLocation: boolean;
    orgGeoList: any;
    specGeoList: any;
    nbnatlasMapUrl: string;
    url: SafeResourceUrl;
    @ViewChild('tabgroup', {static: false}) tabgroup: MatTabGroup;
    private http: any;

    constructor(private route: ActivatedRoute, private apiService: ApiService, private spinner: NgxSpinnerService,
                private router: Router, private sanitizer: DomSanitizer) {
        this.route.params.subscribe(param => this.bioSampleId = param.id);
        this.isLoading = true;
    }

    hideLoader() {
        this.isLoading = false;
    }

    ngOnInit(): void {
        this.geoLocation = false;
        this.dataSourceGoatInfo = {};
        this.activeFilters = [];
        this.relatedRecords = [];
        this.filterJson.sex = '';
        this.filterJson.organismPart = '';
        this.filterJson.trackingSystem = '';
        this.getDisplayedColumns();
        this.getAnnotationDisplayedColumns();
        this.getBiosampleById();
    }


    toggleFilter(key1: string, key2: string): void {
        this.showAllFilters[key1][key2] = !this.showAllFilters[key1][key2];
    }


    getAnnotationDisplayedColumns() {
        this.displayedColumnsAnnotations = [];
        this.displayedColumnsRelatedAnnotation.forEach(obj => {
            if (obj.selected) {
                this.displayedColumnsAnnotations.push(obj.column);
            }
        });
    }

    getDisplayedColumns() {
        this.displayedColumnsFiles = [];
        this.experimentColumnsDefination.forEach(obj => {
            if (obj.selected) {
                this.displayedColumnsFiles.push(obj.column);
            }
        });
    }

    expanded() {
    }

    showSelectedColumn(selectedColumn, checked) {
        const index = this.experimentColumnsDefination.indexOf(selectedColumn);
        const item = this.experimentColumnsDefination[index];
        item.selected = checked;
        this.experimentColumnsDefination[index] = item;
        this.getDisplayedColumns();
        this.getBiosampleById();
    }

    showSelectedAnnotationsColumn(selectedColumn, checked) {
        const index = this.displayedColumnsRelatedAnnotation.indexOf(selectedColumn);
        const item = this.displayedColumnsRelatedAnnotation[index];
        item.selected = checked;
        this.displayedColumnsRelatedAnnotation[index] = item;
        this.getAnnotationDisplayedColumns();
        this.getBiosampleById();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.tabgroup.selectedIndex = 0;
        }, 400);
    }

    getBiosampleById() {
        this.spinner.show();
        this.apiService.getRootOrganismById(this.bioSampleId, 'data_portal')
            .subscribe(
                data => {
                    const unpackedData = [];
                    const unpackedSymbiontsData = [];
                    this.bioSampleObj = data.results[0]._source;
                    this.aggregations = data.aggregations;
                    console.log(this.bioSampleObj.orgGeoList);
                    this.orgGeoList = this.bioSampleObj.orgGeoList;
                    this.specGeoList = this.bioSampleObj.specGeoList;
                    if (this.orgGeoList !== undefined && this.orgGeoList.length !== 0) {
                        this.geoLocation = true;
                        setTimeout(() => {
                            const tabGroup = this.tabgroup;
                            const selected = this.tabgroup.selectedIndex;
                            tabGroup.selectedIndex = 4;
                            setTimeout(() => {
                                this.tabgroup.selectedIndex = selected;
                            }, 1);
                        }, 400);
                    }
                    if (this.bioSampleObj.goat_info) {
                        this.dataSourceGoatInfo = this.bioSampleObj.goat_info.attributes;
                    }

                    if (this.bioSampleObj.experiment?.length > 0) {
                        this.INSDC_ID = this.bioSampleObj.experiment[0].study_accession;
                    }
                    if (this.bioSampleObj.nbnatlas != null) {
                        this.nbnatlasMapUrl = 'https://easymap.nbnatlas.org/Image?tvk=' + this.bioSampleObj.nbnatlas.split('/')[4] + '&ref=0&w=400&h=600&b0fill=6ecc39&title=0';
                        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.nbnatlasMapUrl);
                        this.nbnatlasMapUrl = 'https://records.nbnatlas.org/occurrences/search?q=lsid:' + this.bioSampleObj.nbnatlas.split('/')[4] + '+&nbn_loading=true&fq=-occurrence_status%3A%22absent%22#tab_mapView';
                    }
                    for (const item of this.bioSampleObj.records) {
                        unpackedData.push(this.unpackData(item));
                    }
                    if (this.bioSampleObj.symbionts_records && Array.isArray(this.bioSampleObj.symbionts_records)) {
                        for (const item of this.bioSampleObj.symbionts_records) {
                            unpackedSymbiontsData.push(this.unpackData(item));
                        }
                    }
                    if (unpackedData.length > 0) {
                        this.getFilters();
                    }

                    this.organismName = this.bioSampleObj.organism;
                    this.dataDownloaded = unpackedData;


                    // related organisms tab
                    this.dataSourceRecords = new MatTableDataSource<any>(unpackedData ?? []);
                    setTimeout(() => {
                        this.dataSourceRecords.paginator = this.paginatorOrganisms;
                        this.dataSourceRecords.sort = this.sortOrganisms;
                    });

                    // related symbionts tab
                    this.dataSourceSymbiontsRecords = new MatTableDataSource<any>(unpackedSymbiontsData ?? []);
                    this.dataSourceMetagenomesRecords = new MatTableDataSource<any>(this.bioSampleObj.metagenomes_records ?? []);
                    this.dataSourceMetagenomesAssemblies = new MatTableDataSource<any>(this.bioSampleObj.metagenomes_assemblies ?? []);
                    this.dataSourceMetagenomesRecordsCount = this.bioSampleObj.metagenomes_records &&
                    this.bioSampleObj.metagenomes_records.length > 0 ? this.bioSampleObj.metagenomes_records.length : 0 ;
                    this.dataSourceMetagenomesAssembliesCount = this.bioSampleObj.metagenomes_assemblies &&
                    this.bioSampleObj.metagenomes_assemblies.length > 0 ? this.bioSampleObj.metagenomes_assemblies.length : 0 ;

                    setTimeout(() => {
                        this.dataSourceSymbiontsRecords.paginator = this.paginatorSymbionts;
                        this.dataSourceSymbiontsRecords.sort = this.sortSymbionts;
                        this.dataSourceMetagenomesRecords.paginator = this.paginatorMetagenomes;
                        this.dataSourceMetagenomesRecords.sort = this.sortMetagenomes;
                        this.dataSourceMetagenomesAssemblies.paginator = this.paginatorMetagenomesAssemblies;
                        this.dataSourceMetagenomesAssemblies.sort = this.sortMetagenomesAssemblies;
                    });

                    // related files tab
                    if (this.bioSampleObj?.experiment) {
                        this.dataSourceFiles = new MatTableDataSource<any>(this.bioSampleObj.experiment);
                        this.dataSourceFilesCount = this.bioSampleObj.experiment.length;
                    } else {
                        this.dataSourceFiles = new MatTableDataSource<Sample>();
                        this.dataSourceFilesCount = 0;
                    }
                    setTimeout(() => {
                        if (this.paginator && this.sort) {
                            this.dataSourceFiles.paginator = this.paginatorFiles;
                            this.dataSourceFiles.sort = this.sortFiles;
                        }
                    });

                    // related assemblies
                    if (this.bioSampleObj?.assemblies) {
                        this.dataSourceAssemblies = new MatTableDataSource<any>(this.bioSampleObj.assemblies);
                        this.dataSourceAssembliesCount = this.bioSampleObj.assemblies.length;
                        for (let i = 0; i < this.bioSampleObj.assemblies.length; i++) {
                            this.assembliesurls.push(this.ENA_PORTAL_API_BASE_URL_FASTA + this.bioSampleObj.assemblies[i].accession + '?download=true&gzip=true');
                        }
                    } else {
                        this.dataSourceAssemblies = new MatTableDataSource<Sample>();
                        this.dataSourceAssembliesCount = 0;
                    }
                    setTimeout(() => {
                        if (this.paginator && this.sort) {
                            this.dataSourceAssemblies.paginator = this.paginatorAssemblies;
                            this.dataSourceAssemblies.sort = this.sortAssemblies;
                        }
                    });


                    // annotation section
                    if (this.bioSampleObj?.annotation) {
                        this.dataSourceAnnotation = new MatTableDataSource<any>(this.bioSampleObj.annotation);
                        this.dataSourceAnnotationCount = this.bioSampleObj.annotation.length;
                        for (let i = 0; i < this.bioSampleObj.annotation.length; i++) {
                            this.annotationsurls.push(this.ENA_PORTAL_API_BASE_URL_FASTA + this.bioSampleObj.annotation[i].accession + '?download=true&gzip=true');
                        }
                    } else {
                        this.dataSourceAnnotation = new MatTableDataSource<Sample>();
                        this.dataSourceAnnotationCount = 0;
                    }
                    setTimeout(() => {
                        if (this.paginator && this.sort) {
                            this.dataSourceAnnotation.paginator = this.paginatorAnnotationSection;
                            this.dataSourceAnnotation.sort = this.sortAnnotationSection;
                        }
                    });


                    // related annotation
                    if (this.bioSampleObj?.related_annotation) {
                        this.dataSourceRelatedAnnotation = new MatTableDataSource<any>(this.bioSampleObj.related_annotation);
                        this.dataSourceRelatedAnnotationCount = this.bioSampleObj.related_annotation?.length;
                        for (let i = 0; i < this.bioSampleObj.annotation.length; i++) {
                            this.annotationsurls.push(this.ENA_PORTAL_API_BASE_URL_FASTA + this.bioSampleObj.annotation[i].accession + '?download=true&gzip=true');
                        }
                    } else {
                        this.dataSourceRelatedAnnotation = new MatTableDataSource<Sample>();
                        this.dataSourceRelatedAnnotationCount = 0;
                    }
                    setTimeout(() => {
                        if (this.paginator && this.sort) {
                            this.dataSourceRelatedAnnotation.paginator = this.paginatorAnnotation;
                            this.dataSourceRelatedAnnotation.sort = this.sortAnnotation;
                        }
                    });

                    // symbionts assemblies
                    if (this.bioSampleObj?.symbionts_assemblies) {
                        this.dataSourceSymbiontsAssemblies = new MatTableDataSource<any>(this.bioSampleObj.symbionts_assemblies);
                        this.dataSourceSymbiontsAssembliesCount = this.bioSampleObj.symbionts_assemblies?.length;
                    } else {
                        this.dataSourceSymbiontsAssemblies = new MatTableDataSource<Sample>();
                        this.dataSourceSymbiontsAssembliesCount = 0;
                    }
                    setTimeout(() => {
                        if (this.paginator && this.sort) {
                            this.dataSourceSymbiontsAssemblies.paginator = this.paginatorSymbiontsAssemblies;
                            this.dataSourceSymbiontsAssemblies.sort = this.sortSymbiontsAssemblies;
                        }
                    });

                    this.specBioSampleTotalCount = unpackedData?.length;
                    this.specSymbiontsTotalCount = unpackedSymbiontsData?.length;
                    this.genomeNotes = this.bioSampleObj.genome_notes;

                    setTimeout(() => {
                        this.spinner.hide();
                    }, 500);
                },
                err => {
                    this.spinner.hide();
                    console.log(err);
                }
            );
    }

    filesSearch(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceFiles.filter = filterValue.trim().toLowerCase();
    }

    assembliesSearch(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceAssemblies.filter = filterValue.trim().toLowerCase();
    }

    annotationSearch(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceAnnotation.filter = filterValue.trim().toLowerCase();
    }

    relatedAnnotationSearch(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceRelatedAnnotation.filter = filterValue.trim().toLowerCase();
    }



    metagenomesAssembliesSearch(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceMetagenomesAssemblies.filter = filterValue.trim().toLowerCase();
    }

    symbiontsAssembliesSearch(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceSymbiontsAssemblies.filter = filterValue.trim().toLowerCase();
    }


    applyFilter(label: string, filterValue: string, dataSource: MatTableDataSource<any>, tabName: string): void {
        // reset showAllFilters
        this.showAllFilters = {
            metadataTab: { sex: false, organismPart: false, trackingSystem: false },
            symbiontsTab: { sex: false, organismPart: false, trackingSystem: false },
            metagenomesTab: { sex: false, organismPart: false, trackingSystem: false }
        };

        const index = this.activeFilters.indexOf(filterValue);
        this.createFilterJson(label, filterValue, dataSource);
        if (index !== -1) {
            this.removeFilter(filterValue, dataSource, tabName);
        } else {
            if (label !== 'search') {
                this.activeFilters.push(filterValue);
            }

            dataSource.filter = JSON.stringify(this.filterJson);
            if (tabName === 'metadataTab') {
                this.generateFilters(dataSource.filteredData, 'metadata');
            } else if (tabName === 'symbiontsTab') {
                this.generateFilters(dataSource.filteredData, 'symbionts');
            }else if (tabName === 'metagenomesTab'){
                this.generateFilters(dataSource.filteredData, 'metagenomes');
            }
        }
    }

    getFilters() {
        this.metadataSexFilters = this.aggregations.metadata_filters.sex_filter.buckets;
        this.metadataTrackingSystemFilters = this.aggregations.metadata_filters.tracking_status_filter.buckets;
        this.metadataOrganismPartFilters = this.aggregations.metadata_filters.organism_part_filter.buckets;

        this.symbiontsSexFilters = this.aggregations.symbionts_filters.sex_filter.buckets;
        this.symbiontsTrackingSystemFilters = this.aggregations.symbionts_filters.tracking_status_filter.buckets;
        this.symbiontsOrganismPartFilters = this.aggregations.symbionts_filters.organism_part_filter.buckets;

        this.metagenomesSexFilters = this.aggregations.metagenomes_filters.sex_filter.buckets;
        this.metagenomesTrackingSystemFilters = this.aggregations.metagenomes_filters.tracking_status_filter.buckets;
        this.metagenomesOrganismPartFilters = this.aggregations.metagenomes_filters.organism_part_filter.buckets;
    }


    generateFilters(data: any, filterType: string) {
        const filters = {
            sex: {},
            trackingSystem: {},
            organismPart: {},
        };

        this[`${filterType}SexFilters`] = [];
        this[`${filterType}TrackingSystemFilters`] = [];
        this[`${filterType}OrganismPartFilters`] = [];

        // generate filter counts
        for (const item of data) {
            if (item.sex != null) {
                filters.sex[item.sex] = (filters.sex[item.sex] || 0) + 1;
            }
            if (item.trackingSystem != null) {
                filters.trackingSystem[item.trackingSystem] = (filters.trackingSystem[item.trackingSystem] || 0) + 1;
            }
            if (item.organismPart != null) {
                filters.organismPart[item.organismPart] = (filters.organismPart[item.organismPart] || 0) + 1;
            }
        }

        const createFilterArray = (filterObj) =>
            Object.entries(filterObj).map(([key, doc_count]) => ({key, doc_count}));

        this[`${filterType}SexFilters`] = createFilterArray(filters.sex);
        this[`${filterType}TrackingSystemFilters`] = createFilterArray(filters.trackingSystem);
        this[`${filterType}OrganismPartFilters`] = createFilterArray(filters.organismPart);
    }


    createFilterJson(key, value, dataSource) {
        if (key === 'sex') {
            this.filterJson.sex = value;
        } else if (key === 'organismPart') {
            this.filterJson.organismPart = value;
        } else if (key === 'trackingSystem') {
            this.filterJson.trackingSystem = value;
        } else if (key === 'search') {
            this.filterJson.search = value.toLowerCase();
        }

        dataSource.filterPredicate = (data, filter): boolean => {
            const filterObj: {
                sex: string,
                organismPart: string,
                trackingSystem: string,
                search: string
            } = JSON.parse(filter);

            const sex = !filterObj.sex || data.sex === filterObj.sex;
            const organismPart = !filterObj.organismPart || data.organismPart === filterObj.organismPart;
            const trackingSystem = !filterObj.trackingSystem || data.trackingSystem === filterObj.trackingSystem;

            // apply text search on fields
            const searchText = filterObj.search?.toLowerCase() || '';
            const searchMatch = !searchText ||
                data.sex?.toLowerCase().includes(searchText) ||
                data.organismPart?.toLowerCase().includes(searchText) ||
                data.trackingSystem?.toLowerCase().includes(searchText) ||
                data.accession?.toLowerCase().includes(searchText) ||
                data.commonName?.toLowerCase().includes(searchText);

            return sex && organismPart && trackingSystem && searchMatch;
        };
    }

    getSearchResults(dataType) {
        if (dataType === 'relatedOrganisms') {
            this.applyFilter('search', this.searchText, this.dataSourceRecords, 'metadataTab');
        }

        if (dataType === 'relatedSymbionts') {
            this.applyFilter('search', this.searchSymbiontsText, this.dataSourceSymbiontsRecords, 'symbiontsTab');
        }
        if (dataType === 'relatedMetagenomes') {
            this.applyFilter('search', this.searchMetagenomesText, this.dataSourceMetagenomesRecords, 'metagenomesTab');
        }

    }


    unpackData(data: any) {
        const dataToReturn = {};
        if (data.hasOwnProperty('_source')) {
            data = data._source;
        }
        for (const key of Object.keys(data)) {
            if (key === 'organism') {
                dataToReturn[key] = data.organism.text;
            } else {
                if (key === 'commonName' && data[key] == null) {
                    dataToReturn[key] = '-';
                } else {
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


    removeFilter(filter: string, dataSource: MatTableDataSource<any>, tabName: string) {
        if (filter !== undefined) {
            const filterIndex = this.activeFilters.indexOf(filter);
            if (this.activeFilters.length !== 0) {
                this.spliceFilterArray(filter);
                this.activeFilters.splice(filterIndex, 1);
                dataSource.filter = JSON.stringify(this.filterJson);
                if (tabName === 'metadataTab') {
                    this.generateFilters(dataSource.filteredData, 'metadata');
                } else if (tabName === 'symbiontsTab') {
                    this.generateFilters(dataSource.filteredData, 'symbionts');
                }else if (tabName === 'metagenomesTab') {
                        this.generateFilters(dataSource.filteredData, 'metagenomes');
                }

            } else {
                this.filterJson.sex = '';
                this.filterJson.organismPart = '';
                this.filterJson.trackingSystem = '';
                dataSource.filter = JSON.stringify(this.filterJson);
                // this.getBiosampleById();
            }
        }
    }

    spliceFilterArray(filter: string) {
        if (this.filterJson.sex === filter) {
            this.filterJson.sex = '';
        } else if (this.filterJson.organismPart === filter) {
            this.filterJson.organismPart = '';
        } else if (this.filterJson.trackingSystem === filter) {
            this.filterJson.trackingSystem = '';
        }
    }


    getStatusStyle(status: string) {
        if (status === 'Annotation Complete') {
            return ['#8FBC45', 'white_text_chip'];
        } else {
            return ['#FFC107', 'dark_text_chip'];
        }
    }


    checkTolidExists(data) {
        return data !== undefined && data.tolid !== undefined && data.tolid != null && data.tolid.length > 0 &&
            data.show_tolqc === true;
    }

    generateTolidLink(data) {
        const organismName = data.organism.split(' ').join('_');
        if (typeof (data.tolid) === 'string') {
            const clade = this.codes[data.tolid.charAt(0)];
            return `https://tolqc.cog.sanger.ac.uk/darwin/${clade}/${organismName}`;

        } else {
            if (data.tolid.length > 0) {
                const clade = this.codes[data.tolid[0].charAt(0)];
                return `https://tolqc.cog.sanger.ac.uk/darwin/${clade}/${organismName}`;
            }
        }
    }


    downloadRawFiles(): void {
        this.apiService.downloadFastaq(this.INSDC_ID);
    }

    downloadAnnotation(): void {
        this.download_files(this.annotationsurls);

    }

    downloadAssemblies(): void {
        this.download_files(this.assembliesurls);
    }

    download_files(files) {
        function download_next(i) {
            if (i >= files.length) {
                return;
            }
            const a = document.createElement('a');
            a.href = files[i];
            a.target = '_parent';
            // Use a.download if available, it prevents plugins from opening.
            if ('download' in a) {
                a.download = files[i].filename;
            }
            // Add a to the doc for click to work.
            (document.body || document.documentElement).appendChild(a);
            if (a.click) {
                a.click(); // The click method is supported by most browsers.
            } else {
                $(a).click(); // Backup using jquery
            }
            // Delete the temporary link.
            a.parentNode.removeChild(a);
            // Download the next file with a small timeout. The timeout is necessary
            // for IE, which will otherwise only download the first file.
            setTimeout(function() {
                download_next(i + 1);
            }, 500);
        }

        // Initiate the first download.
        download_next(0);
    }

    typeofTol(tolid: any) {
        if (typeof (tolid) === 'string') {
            return tolid;
        } else {
            return tolid.join(', ');
        }
    }

    downloadCSV(tableName, fileName) {
        const {headers, cellNames} = TABLE_CONFIG[tableName] || {headers: [], cellNames: []};

        const csvRows = [];
        csvRows.push(headers.join(','));

        this.dataDownloaded.forEach((row: any) => {
            const values = cellNames.map(key => row[key] || '');
            csvRows.push(values.map(val => `"${val}"`).join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    sanitizeHTML(content: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }

    openPopup(imageUrl: string) {
        this.popupImage = imageUrl;
    }

    closePopup() {
        this.popupImage = null;
    }

    tabClick({$event}: { $event: any }) {
        this.resetDataset($event.tab.textLabel);
    }


    resetDataset(tabName){
        this.activeFilters = [];
        this.searchText = '';
        this.searchSymbiontsText = '';
        this.searchMetagenomesText = '';
        this.filterJson = {
            sex: '',
            organismPart: '',
            trackingSystem: '',
            search: ''
        };

        if (tabName === 'Metadata') {
            this.dataSourceRecords.filterPredicate = (data, filter) => true;
            this.dataSourceRecords.filter = '';
            this.generateFilters(this.dataSourceRecords.filteredData, 'metadata');
        } else if (tabName === 'Symbionts') {
            this.dataSourceSymbiontsRecords.filterPredicate = (data, filter) => true;
            this.dataSourceSymbiontsRecords.filter = '';
            this.generateFilters(this.dataSourceSymbiontsRecords.filteredData, 'symbionts');
        }else if (tabName === 'Metagenomes') {
            this.dataSourceMetagenomesRecords.filterPredicate = (data, filter) => true;
            this.dataSourceMetagenomesRecords.filter = '';
            this.generateFilters(this.dataSourceMetagenomesRecords.filteredData, 'metagenomes');
        }
    }

}
