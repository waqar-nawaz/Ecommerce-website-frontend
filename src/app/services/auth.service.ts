import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: any = environment.apiUrl;
  constructor() { }

  http = inject(HttpClient);
  router = inject(Router);

  // Simulate checking authentication status

  login(data: object) {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  signup(data: object): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/signup`, data);
  }

  updateUser(data: object, id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/user/${id}`, data);
  }

  getuser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/user`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/user/${id}`);
  }

  isAuthenticated(): boolean {
    // Check if localStorage is available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false; // Not authenticated if localStorage is not available
  }

  getToken() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return token;
    }

    return false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
