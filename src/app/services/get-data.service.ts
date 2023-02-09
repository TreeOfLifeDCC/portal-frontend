import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  private API_BASE_URL = 'https://portal.darwintreeoflife.org/statuses_update/';

  constructor(private http: HttpClient) { }

  // @ts-ignore
  public getAllPublications(offset, limit, filter?): Observable<any> {
    console.log(filter);
    return this.http.get(`${this.API_BASE_URL}articles?offset=${offset}&limit=${limit}`);
  }
}
