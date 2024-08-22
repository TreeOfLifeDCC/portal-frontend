import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',

})
export class ApiService {

    constructor(private http: HttpClient) {
    }

    getData(pageIndex: number, pageSize: number, searchValue: string, sortActive: string, sortDirection: string,
            filterValue: string[], currentClass: string, phylogeny_filters: string[], index_name: string) {

        const project_names = ['DToL', '25 genomes', 'ERGA', 'CBP', 'ASG'];
        const offset = pageIndex * pageSize;
        let url = `https://portal.erga-biodiversity.eu/api/${index_name}?limit=${pageSize}&offset=${offset}`;
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

        return this.http.get<any>(url);
    }

    getDetailsData(organismName: any, indexName = 'data_portal') {
        const url = `https://portal.erga-biodiversity.eu/api/${indexName}/${organismName}`;
        return this.http.get<any>(url);
    }

    getSummaryData() {
        return this.http.get<any>('https://portal.erga-biodiversity.eu/api/summary');
    }

    downloadRecords(pageIndex: number, pageSize: number, searchValue: string, sortActive: string, sortDirection: string,
                    filterValue: string[], currentClass: string, phylogeny_filters: string[], index_name: string,) {
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
        return this.http.get(url, {responseType: 'blob' as 'blob'});


    }


}
