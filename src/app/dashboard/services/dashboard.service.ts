import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Sample } from '../model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API_BASE_URL: string = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  public getAllBiosample(offset, limit): Observable<any> {
    let params = new HttpParams();
    params = params.set('page', offset);
    params = params.set('size', limit);

    return this.http.get(`${this.API_BASE_URL}/dtol?${params.toString()}`)
  }

  public createBiosample(data: any): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/dtol/sample`, data);
  }

  public getBiosampleByAccession(accession: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/dtol/${accession}`)
  }

}
