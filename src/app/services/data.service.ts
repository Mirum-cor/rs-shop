import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { ROOT_REQUEST_URL } from '../utils/utilities';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private store: Store) { }

  getHttpResponse(requestQuery: string) {
    const responseUrl = `${ROOT_REQUEST_URL}/${requestQuery}`;
    return this.http.get(responseUrl);
  }
}
