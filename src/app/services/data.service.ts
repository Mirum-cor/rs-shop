import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { ROOT_REQUEST_URL } from '../utils/utilities';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private store: Store) { }

  getCategories() {
    const responseUrl = `${ROOT_REQUEST_URL}/categories`;
    return this.http.get(responseUrl);
  }

  getAllGoods() {
    const responseUrl = `${ROOT_REQUEST_URL}/goods`;
    return this.http.get(responseUrl);
  }

  getCategoryGoods(categoryId: string) {
    const responseUrl = `${ROOT_REQUEST_URL}/goods/category/${categoryId}`;
    return this.http.get(responseUrl);
  }
}
