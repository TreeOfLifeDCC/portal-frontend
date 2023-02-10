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
    const filters = [];
    let url = `${this.API_BASE_URL}articles?offset=${offset}&limit=${limit}`;
    for (const key of filter) {
      if (['Genome Note', 'Research Article'].indexOf(key) !== -1) {
        filters.push(`articleType=${key}`);
      } else if (['2020', '2021', '2022'].indexOf(key) !== -1) {
        filters.push(`pubYear=${key}`);
      } else {
        filters.push(`journalTitle=${key}`);
      }
    }
    for (const key of filters) {
      url = `${url}&${key}`;
    }
    return this.http.get(url);
  }
}
