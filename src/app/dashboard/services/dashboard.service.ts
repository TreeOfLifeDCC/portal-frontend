import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';
  private ENA_PORTAL_API_BASE_URL = 'https://www.ebi.ac.uk/ena/portal/api/files';

  constructor(private http: HttpClient) { }

  public getAllBiosample(offset, limit, sortColumn?, sortOrder?, searchText?, filter?): Observable<any> {
    let requestParams = `?offset=${offset}&limit=${limit}`
    if (sortColumn != undefined) {
      requestParams = requestParams + `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    }
    if(searchText) {
      requestParams = requestParams + `&searchText=${searchText}`
    }
    return this.http.post(`${this.API_BASE_URL}/root_organisms${requestParams}`, filter);
  }


}
