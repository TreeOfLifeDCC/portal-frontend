import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Sample } from '../model/dashboard.model';
import {ConfirmationDialogComponent} from "../../confirmation-dialog-component/confirmation-dialog.component";
import {BytesPipe} from "../../shared/bytes-pipe";
import {MatDialog} from "@angular/material/dialog";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';
  private ENA_PORTAL_API_BASE_URL = 'https://www.ebi.ac.uk/ena/portal/api/files';

  // private API_BASE_URL = 'http://8000/TCP/api';
  // private API_BASE_URL = 'http://45.88.81.118/api';
  // private API_BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient, private bytesPipe: BytesPipe,  private dialog: MatDialog) { }

  public getAllBiosample(offset, limit, sortColumn?, sortOrder?, searchText?): Observable<any> {
    let requestParams = `?offset=${offset}&limit=${limit}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    if(searchText) {
      requestParams = requestParams + `&searchText=${searchText}`
    }
    return this.http.get(`${this.API_BASE_URL}/root_organisms${requestParams}`);
  }

  public getDistinctOrganisms(size, sortColumn?, sortOrder?, afterKey?): Observable<any> {
    let requestParams = `?size=${size}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    if (afterKey != undefined) {
      requestParams = requestParams + `&afterKey=${afterKey}`
    }
    return this.http.get(`${this.API_BASE_URL}/root_organisms${requestParams}`);
  }

  public getBiosampleByAccession(accession: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/organisms/${accession}`);
  }

  public getSpecimenByAccession(accession: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/organisms/specimen/${accession}`);
  }

  public getRootOrganismByOrganism(organism: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/${organism}`);
  }

  public getRootOrganismById(id: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/root?id=${id}`);
  }

  public getRootOrganismByAccession(accession: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/accession/${accession}`);
  }

  public getOrganismFilters(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/root/filters`);
  }
  public getExperimentTypeFilters(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/root/experiment-type/filters`);
  }

  public getRootOrganismFilters(organism): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/filters?organism=${organism}`);
  }

  public getDetailTableOrganismFilters(organism): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/secondary/filters?organism=${organism}`);
  }

  public getSpecimenFilters(accession): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/organisms/filters?accession=${accession}`);
  }

  public getSearchResults(search: any, from?, size?): Observable<any> {
    let requestURL = `${this.API_BASE_URL}/root_organisms/search?filter=${search}&from=${from}&size=${size}`;
    return this.http.get(`${requestURL}`);
  }

  public getRootSearchResults(search: any,sortColumn?, sortOrder?, from?, size?): Observable<any> {
    let requestParams = `?filter=${search}&from=${from}&size=${size}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    let requestURL = `${this.API_BASE_URL}/root_organisms/search${requestParams}`;
    return this.http.get(`${requestURL}`);
  }

  public getFilterResults(filter: any,sortColumn?, sortOrder?, from?, size?, taxonomyFilter?, searchText?): Observable<any> {
    let requestParams = `?from=${from}&size=${size}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    if(taxonomyFilter != undefined) {
      let taxa = encodeURIComponent(JSON.stringify(taxonomyFilter[0]));
      requestParams = requestParams + `&taxonomyFilter=${taxa}`
    }
    if(searchText) {
      requestParams = requestParams + `&searchText=${searchText}`
    }
    let requestURL = `${this.API_BASE_URL}/root_organisms/root/filter/results${requestParams}`;
    return this.http.post(`${requestURL}`,filter);
  }

  public downloadCSV(filter: any,sortColumn?, sortOrder?, from?, size?, taxonomyFilter?, searchText?): any {
    let requestParams = `?from=${from}&size=${size}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    if(taxonomyFilter != undefined) {
      let taxa = encodeURIComponent(JSON.stringify(taxonomyFilter[0]));
      requestParams = requestParams + `&taxonomyFilter=${taxa}`
    }
    if(searchText) {
      requestParams = requestParams + `&searchText=${searchText}`
    }
    let requestURL = `${this.API_BASE_URL}/root_organisms/data/csv${requestParams}`;
		return this.http.post(`${requestURL}`,filter, {responseType: 'blob'});
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
}
