import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusesService {

  private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';
  // private API_BASE_URL = 'http://45.88.81.118/api';
  // private API_BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getAllStatuses(offset, limit, sortColumn?, sortOrder?, searchText?): Observable<any> {
    let requestParams = `?offset=${offset}&limit=${limit}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    if(searchText) {
      requestParams = requestParams + `&searchText=${searchText}`
    }
    return this.http.get(`${this.API_BASE_URL}/statuses${requestParams}`);
  }

  public getBiosampleByOrganism(organism: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/statuses/detail/${organism}`);
  }

  public getStatusesFilters(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/statuses/filters`);
  }

  public getSearchResults(search: any, sortColumn?, sortOrder?, from?, size?): Observable<any> {
    let requestURL = `${this.API_BASE_URL}/statuses/search?filter=${search}&from=${from}&size=${size}`;
    if (sortColumn != undefined) {
      requestURL = requestURL + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    return this.http.get(`${requestURL}`);
  }

  public getFilterResults(filter: any, sortColumn?, sortOrder?, from?, size?, taxonomyFilter?, searchText?): Observable<any> {
    let requestURL = `${this.API_BASE_URL}/statuses/filter/results?from=${from}&size=${size}`;
    if (sortColumn != undefined) {
      requestURL = requestURL + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`;
    }
    if(taxonomyFilter != undefined) {
      let taxa = encodeURIComponent(JSON.stringify(taxonomyFilter[0]));
      requestURL = requestURL + `&taxonomyFilter=${taxa}`
    }
    if(searchText) {
      requestURL = requestURL + `&searchText=${searchText}`
    }
    return this.http.post(`${requestURL}`, filter);
  }

  public findBioSampleByOrganismName(name: any, sortColumn?, sortOrder?, from?, size?): Observable<any> {
    let requestURL = `${this.API_BASE_URL}/statuses/organism?name=${name}&from=${from}&size=${size}`;
    if (sortColumn != undefined) {
      requestURL = requestURL + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    return this.http.get(`${requestURL}`);
  }

}
