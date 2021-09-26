import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { ROOT_REQUEST_URL } from '../utils/utilities';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private store: Store) {}

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

  getProduct(productId: string) {
    const responseUrl = `${ROOT_REQUEST_URL}/goods/item/${productId}`;
    return this.http.get(responseUrl);
  }

  getToken(login: string, password: string) {
    const responseUrl = `${ROOT_REQUEST_URL}/users/register`;
    return this.http.post(responseUrl, {
      firstName: '',
      lastName: '',
      login,
      password,
    });
  }

  setFavorite(id: string) {
    const responseUrl = `${ROOT_REQUEST_URL}/users/favorites`;
    return this.http.post(responseUrl, { id });
  }

  removeFromFavorite(id: string) {
    const responseUrl = `${ROOT_REQUEST_URL}/users/favorites?id=${id}`;
    return this.http.delete(responseUrl);
  }

  setCart(id: string) {
    const responseUrl = `${ROOT_REQUEST_URL}/users/cart`;
    return this.http.post(responseUrl, { id });
  }

  removeFromCart(id: string) {
    const responseUrl = `${ROOT_REQUEST_URL}/users/cart?id=${id}`;
    return this.http.delete(responseUrl);
  }
}
