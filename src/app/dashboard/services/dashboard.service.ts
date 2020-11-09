import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Sample } from '../model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';

  constructor(private http: HttpClient) { }

  public getAllBiosample(offset,limit): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/organisms?offset=${offset}&limit=${limit}`);
  }

  public createBiosample(data: any): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/organisms/sample`, data);
  }

  public getBiosampleByAccession(accession: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/organisms/${accession}`);
  }

}