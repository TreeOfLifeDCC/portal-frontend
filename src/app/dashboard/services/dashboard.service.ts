import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Sample } from '../model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';
  private API_BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getAllBiosample(offset, limit, sortColumn?, sortOrder?): Observable<any> {
    let requestParams = `?offset=${offset}&limit=${limit}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    return this.http.get(`${this.API_BASE_URL}/root_samples${requestParams}`);
  }

  public createBiosample(data: any): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/root_samples/sample`, data);
  }

  public getBiosampleByAccession(accession: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/organisms/${accession}`);
  }

  public getRootsampleByAccession(accession: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_samples/${accession}`);
  }

  public getRootsampleByOrganism(organism: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_samples/organism/${organism}`);
  }

  public getOrganismFilters(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_samples/filters`);
  }

  public getSearchResults(search: any, sortColumn?, sortOrder?, from?, size?): Observable<any> {
    let requestURL = `${this.API_BASE_URL}/root_samples/search?filter=${search}&from=${from}&size=${size}`;
    if (sortColumn != undefined) {
      requestURL = requestURL + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    return this.http.get(`${requestURL}`);
  }

  public getFilterResults(filter: any, sortColumn?, sortOrder?, from?, size?): Observable<any> {
    let requestURL = `${this.API_BASE_URL}/root_samples/filter/results?from=${from}&size=${size}`;
    if (sortColumn != undefined) {
      requestURL = requestURL + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`;
    }
    return this.http.post(`${requestURL}`,filter);
  }

}
