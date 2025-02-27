import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {catchError, map, retry, tap} from 'rxjs/operators';
import { ConfirmationDialogComponent } from './confirmation-dialog-component/confirmation-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',

})
export class ApiService {

    private ENA_PORTAL_API_BASE_URL = 'https://www.ebi.ac.uk/ena/portal/api/files';
    private API_BASE_URL = 'https://python-portal-backend-725097469588.europe-west2.run.app';
    // private API_BASE_URL = 'http://localhost:8000';
    dialog: any;
    bytesPipe: any;

    constructor(private http: HttpClient) {
    }

    getData(pageIndex: number, pageSize: number, searchValue: string, sortActive: string, sortDirection: string,
            filterValue: string[], currentClass: string, phylogenyFilters: string[], indexName: string) {

        const projectNames = ['DToL', '25 genomes', 'ERGA', 'CBP', 'ASG'];
        const offset = pageIndex * pageSize;
        let url = `${this.API_BASE_URL}/${indexName}?limit=${pageSize}&offset=${offset}`;
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
                if (projectNames.indexOf(filterValue[i]) !== -1) {
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
                        } else {
                            filterItem = `${filterItem}:Done`;
 }
                    }
                }else if (filterValue[i].includes('_') && filterValue[i].startsWith('experimentType')) {
                    filterItem = filterValue[i].replace('_', ':');

                }
                else {
                    filterItem = `${currentClass}:${filterValue[i]}`;
                }

                filterStr === '&filter=' ? filterStr += `${filterItem}` : filterStr += `,${filterItem}`;

            }
            url += filterStr;
        }
        if (phylogenyFilters.length !== 0) {
            let filterStr = '&phylogeny_filters=';
            for (let i = 0; i < phylogenyFilters.length; i++) {
                filterStr === '&phylogeny_filters=' ? filterStr += `${phylogenyFilters[i]}` : filterStr += `-${phylogenyFilters[i]}`;
            }

            url += filterStr;
        }
        url += `&current_class=${currentClass}`;
        console.log(url);

        return this.http.get<any>(url);
    }

    getRootOrganismById(organismName: any, indexName = 'data_portal') {
        const url = `${this.API_BASE_URL}/${indexName}/${organismName}`;
        return this.http.get<any>(url);
    }

    public getBiosampleByAccession(accession: string): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/organisms_test/${accession}`);
    }

    public getSpecimenByAccession(accession: string): Observable<any> {
        return this.http.get(`${this.API_BASE_URL}/specimens_test/${accession}`);
    }


    downloadData(downloadOption: string, pageIndex: number, pageSize: number, searchValue: string, sortActive: string,
                 sortDirection: string, filterValue: string[], currentClass: string, phylogenyFilters: string[],
                 indexName: string) {

        const url = `${this.API_BASE_URL}/data-download`;
        const projectNames = ['DToL', '25 genomes', 'ERGA', 'CBP', 'ASG'];

        // phylogeny
        const phylogenyStr = phylogenyFilters.length ? phylogenyFilters.join('-') : '';

        // filter string
        let filterStr = '';

        if (filterValue.length > 0) {
            filterStr = filterValue.map(value => {
                if (projectNames.includes(value)) {
                    return value === 'DToL' ? 'project_name:dtol' : `project_name:${value}`;
                } else if (value.includes('-')) {
                    if (value.startsWith('symbionts')) {
                        return value.replace('-', ':');
                    } else {
                        const status = value.split(' - ')[0].toLowerCase().replace(/\s/g, '_');
                        return status === 'assemblies' ? 'assemblies_status:Done' : `${status}:Done`;
                    }
                } else {
                    return `${currentClass}:${value}`;
                }
            }).join(',');
        }

        const payload = {
            pageIndex,
            pageSize,
            searchValue,
            sortValue: `${sortActive}:${sortDirection}`,
            filterValue: filterStr || '',
            currentClass,
            phylogenyFilters: phylogenyStr,
            indexName,
            downloadOption
        };

        console.log(payload);

        return this.http.post(url, payload, { responseType: 'blob' });
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
    public download(filter: any, sortColumn?, sortOrder?, from?, size?, taxonomyFilter?, searchText? , downloadOption?): any {
        let requestParams = `?from=${from}&size=${size}`;
        if (sortColumn !== undefined) {
          requestParams = requestParams + `&z=${sortColumn}&sortOrder=${sortOrder}`;
        }
        if (taxonomyFilter !== undefined) {
          const taxa = encodeURIComponent(JSON.stringify(taxonomyFilter[0]));
          requestParams = requestParams + `&taxonomyFilter=${taxa}`;
        }
        if (searchText) {
          requestParams = requestParams + `&searchText=${searchText}`;
        }
        const requestURL = `${this.API_BASE_URL}/root_organisms/data-files/csv${requestParams}&downloadOption=` + downloadOption;
        return this.http.post(`${requestURL}`, filter, {responseType: 'blob'});
      }

}

