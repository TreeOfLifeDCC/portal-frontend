import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";

import {catchError, map, retry, tap} from 'rxjs/operators';
import { ConfirmationDialogComponent } from './confirmation-dialog-component/confirmation-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',

})
export class ApiService {

    private ENA_PORTAL_API_BASE_URL = 'https://www.ebi.ac.uk/ena/portal/api/files';
    private API_BASE_URL = 'http://localhost:8000';
    dialog: any;
    bytesPipe: any;

    constructor(private http: HttpClient) {
    }

    getData(pageIndex: number, pageSize: number, searchValue: string, sortActive: string, sortDirection: string,
            filterValue: string[], currentClass: string, phylogeny_filters: string[], index_name: string) {

        const project_names = ['DToL', '25 genomes', 'ERGA', 'CBP', 'ASG'];
        const offset = pageIndex * pageSize;
        let url = `http://localhost:8000/${index_name}?limit=${pageSize}&offset=${offset}`;
        if (searchValue) {
            url += `&search=${searchValue}`;
        }
        if (sortActive && sortDirection) {
            url += `&sort=${sortActive}:${sortDirection}`;
        }
        if (filterValue.length !== 0) {
            let filterStr = '&filter=';
            let filterItem;
            for (let i = 0; i < filterValue.length; i++) {
                if (project_names.indexOf(filterValue[i]) !== -1) {
                    filterValue[i] === 'DToL' ? filterItem = 'project_name:dtol' : filterItem = `project_name:${filterValue[i]}`;
                } else if (filterValue[i].includes('-') && !filterValue[i].startsWith('experimentType')) {
                    if (filterValue[i].startsWith('symbionts')) {
                        filterItem = filterValue[i].replace('-', ':');
                    } else {
                        filterItem = filterValue[i].split(' - ')[0].toLowerCase().split(' ').join('_');
                        if (filterItem === 'assemblies') {
                            filterItem = 'assemblies_status:Done';
                        }else if (filterItem === 'genome_notes') {
                            filterItem = 'genome_notes:Submitted';
                        } else
                            filterItem = `${filterItem}:Done`;
                    }
                }else if(filterValue[i].includes('_') && filterValue[i].startsWith('experimentType')) {
                    filterItem = filterValue[i].replace('_', ':');

                }
                else {
                    filterItem = `${currentClass}:${filterValue[i]}`;
                }
               
                filterStr === '&filter=' ? filterStr += `${filterItem}` : filterStr += `,${filterItem}`;

            }
            url += filterStr;
        }
        if (phylogeny_filters.length !== 0) {
            let filterStr = '&phylogeny_filters=';
            for (let i = 0; i < phylogeny_filters.length; i++) {
                filterStr === '&phylogeny_filters=' ? filterStr += `${phylogeny_filters[i]}` : filterStr += `-${phylogeny_filters[i]}`;
            }

            url += filterStr;
        }
        url += `&current_class=${currentClass}`;

        return this.http.get<any>(url);
    }

    getRootOrganismById(organismName: any, indexName = 'data_portal') {
        const url = `http://localhost:8000/${indexName}/${organismName}`;
        return this.http.get<any>(url);
    }

    getSummaryData() {
        return this.http.get<any>('https://portal.erga-biodiversity.eu/api/summary');
    }

    public getBiosampleByAccession(accession: string): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/organisms_test/${accession}`);
    }

    public getSpecimenByAccession(accession: string): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/specimens_test/${accession}`);
    }


    downloadRecords(pageIndex: number, pageSize: number, searchValue: string, sortActive: string, sortDirection: string,
                    filterValue: string[], currentClass: string, phylogeny_filters: string[], index_name: string) {
        const project_names = ['DToL', '25 genomes', 'ERGA', 'CBP', 'ASG'];
        const offset = pageIndex * pageSize;
        let url = `https://portal.erga-biodiversity.eu/api/export-csv/?limit=${pageSize}&offset=${offset}`;
        if (searchValue) {
            url += `&search=${searchValue}`;
        }
        if (sortActive && sortDirection) {
            url += `&sort=${sortActive}:${sortDirection}`;
        }
        if (filterValue.length !== 0) {
            let filterStr = '&filter=';
            let filterItem;
            for (let i = 0; i < filterValue.length; i++) {
                if (project_names.indexOf(filterValue[i]) !== -1) {
                    filterValue[i] === 'DToL' ? filterItem = 'project_name:dtol' : filterItem = `project_name:${filterValue[i]}`;
                } else if (filterValue[i].includes('-')) {
                    if (filterValue[i].startsWith('symbionts')) {
                        filterItem = filterValue[i].replace('-', ':');
                    } else {
                        filterItem = filterValue[i].split(' - ')[0].toLowerCase().split(' ').join('_');
                        if (filterItem === 'assemblies') {
                            filterItem = 'assemblies_status:Done';
                        } else
                            filterItem = `${filterItem}:Done`;
                    }
                } else {
                    filterItem = `${currentClass}:${filterValue[i]}`;
                }
                filterStr === '&filter=' ? filterStr += `${filterItem}` : filterStr += `,${filterItem}`;

            }
            url += filterStr;
        }
        if (phylogeny_filters.length !== 0) {
            let filterStr = '&phylogeny_filters=';
            for (let i = 0; i < phylogeny_filters.length; i++) {
                filterStr === '&phylogeny_filters=' ? filterStr += `${phylogeny_filters[i]}` : filterStr += `-${phylogeny_filters[i]}`;
            }

            url += filterStr;
        }
        url += `&current_class=${currentClass}`;
        return this.http.get(url, {responseType: 'blob' as const});


    }

    public downloadFastaq(accession: any): any {
        const result = 'read_run';
        const field = 'fastq_ftp';
        const body = `result=${result}&accession=${accession}&field=${field}&count=true`;

        const requestURL = this.ENA_PORTAL_API_BASE_URL;
        return this.http.post(`${requestURL}`, body, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).pipe(
            tap((response: any) => {
                this.dialog.open(ConfirmationDialogComponent, {
                    width: '550px',
                    autoFocus: false,
                    data: {
                        field: 'fastq_ftp',
                        fileCount: response.totalFiles,
                        fileSize: this.bytesPipe.transform(response.totalFileSize),
                        accession,
                        url: this.ENA_PORTAL_API_BASE_URL
                    }
                });
            })).subscribe();
    }
    public getDetailTableOrganismFilters(organism): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/root_organisms/secondary/filters?organism=${organism}`);
    }
    public download(filter: any,sortColumn?, sortOrder?, from?, size?, taxonomyFilter?, searchText? , downloadOption?): any {
        let requestParams = `?from=${from}&size=${size}`
        if (sortColumn != undefined) {
          requestParams = requestParams + `&z=${sortColumn}&sortOrder=${sortOrder}`
        }
        if(taxonomyFilter != undefined) {
          let taxa = encodeURIComponent(JSON.stringify(taxonomyFilter[0]));
          requestParams = requestParams + `&taxonomyFilter=${taxa}`
        }
        if(searchText) {
          requestParams = requestParams + `&searchText=${searchText}`
        }
        let requestURL = `${this.API_BASE_URL}/root_organisms/data-files/csv${requestParams}&downloadOption=` + downloadOption;
        return this.http.post(`${requestURL}`, filter, {responseType: 'blob'});
      }
   
}

