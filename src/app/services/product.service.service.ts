import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  apiUrl: string = environment.apiUrl;
  http = inject(HttpClient);

  constructor() {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Check if localStorage is available
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  getProduct(currentPage: any) {
    console.log(currentPage);
    const params = new HttpParams()
      .set('currentPage', currentPage)
      .set('perPage', 10);

    return this.http.get(`${this.apiUrl}feed/post`, {
      headers: this.getHeaders(),
      params: params,
    });
  }

  createProduct(data: any) {
    return this.http.post(`${this.apiUrl}feed/post`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
      },
    });
  }

  updateProduct(id: any, data: any) {
    return this.http.put(`${this.apiUrl}feed/post/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token
      },
    });
  }

  deleteProduct(id: any) {
    return this.http.delete(`${this.apiUrl}feed/post/${id}`, {
      headers: this.getHeaders(),
    });
  }

  searchProducts(query: string): Observable<any> {
    const params = new HttpParams().set('search', query);
    return this.http.get(`${this.apiUrl}feed/post/search`, {
      headers: this.getHeaders(),
      params,
    });
  }

  getProductById(id: any) {
    return this.http.get(`${this.apiUrl}feed/post/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
