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

  getPost(currentPage: any): Observable<any> {
    // console.log(currentPage);
    const params = new HttpParams()
      .set('currentPage', currentPage)
      .set('perPage', 10);

    return this.http.get(`${this.apiUrl}feed/post`, {
      params: params,
    });
  }
  getProduct(id: any): Observable<any> {
    const params = new HttpParams().set('categoryId', id ? id : '');
    return this.http.get(`${this.apiUrl}api/product`, {
      params: params,
    });
  }

  createPost(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}feed/post`, data);
  }
  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}api/product`, data);
  }
  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}api/category`, data);
  }

  getCategory(currentPage: any): Observable<any> {
    return this.http.get(`${this.apiUrl}api/category`);
  }

  updateProduct(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}feed/post/${id}`, data);
  }

  deletePost(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}feed/post/${id}`, {});
  }
  deleteProduct(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}api/product/${id}`, {});
  }

  searchProducts(query: string): Observable<any> {
    const params = new HttpParams().set('search', query);
    return this.http.get(`${this.apiUrl}feed/post/search`, {
      params,
    });
  }

  getPostById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}feed/post/${id}`, {});
  }
  getProductById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}api/product/${id}`);
  }
}
