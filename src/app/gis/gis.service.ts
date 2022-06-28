import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GisService {

  private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';
  // private API_BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getgisData(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/root_organisms/gis`);
  }
}
