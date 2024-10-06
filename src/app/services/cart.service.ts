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

  getCategory(currentPage: any): Observable<any> {
    // console.log(currentPage);
    // const params = new HttpParams()
    //   .set('currentPage', currentPage)
    //   .set('perPage', 10);

    return this.http.get(`${this.apiUrl}api/cart`, {
      headers: this.getHeaders(),
      // params: params,
    });
  }
}
