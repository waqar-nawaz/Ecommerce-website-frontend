import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  apiUrl: string = environment.apiUrl;
  http = inject(HttpClient);

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

  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/${userId}`, {
      headers: this.getHeaders(),
      // params: params,
    });
  }

  addToCart(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart`, data, {
      headers: this.getHeaders(),
      // params: params,
    });
  }
  updateCart(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteCartItem(data: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart`, {
      headers: this.getHeaders(),
      body: data, // Pass data here as 'body'
    });
  }

  checkout(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order`, data)
  }

  getOrder(): Observable<any> {
    return this.http.get(`${this.apiUrl}/order`);
  }
}