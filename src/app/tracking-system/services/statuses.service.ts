import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusesService {

  private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';

  constructor(private http: HttpClient) { }

  public getAllStatuses(offset, limit): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/statuses?offset=${offset}&limit=${limit}`);
  }

  public getBiosampleByOrganism(organism: string): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/organisms/detail/${organism}`);
  }
}
