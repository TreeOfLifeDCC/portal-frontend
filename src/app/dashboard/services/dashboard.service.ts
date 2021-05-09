import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Sample } from '../model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';
  // private API_BASE_URL = 'http://45.86.170.227:30985';
  // private API_BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getAllBiosample(offset, limit, sortColumn?, sortOrder?): Observable<any> {
    let requestParams = `?offset=${offset}&limit=${limit}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
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

  public getRootOrganismByAccession(accession: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/accession/${accession}`);
  }

  public getOrganismFilters(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/root/filters`);
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

  public getFilterResults(filter: any,sortColumn?, sortOrder?, from?, size?, taxonomyFilter?): Observable<any> {
    let requestParams = `?from=${from}&size=${size}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    if(taxonomyFilter != undefined) {
      let taxa = encodeURIComponent(JSON.stringify(taxonomyFilter[0]));
      requestParams = requestParams + `&taxonomyFilter=${taxa}`
    }
    let requestURL = `${this.API_BASE_URL}/root_organisms/root/filter/results${requestParams}`;
    return this.http.post(`${requestURL}`,filter);
  }

}
