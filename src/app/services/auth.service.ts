import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: any = environment.apiUrl;

  constructor() {}
  http = inject(HttpClient);
  router = inject(Router);
  login(data: object) {
    return this.http.post(`${this.apiUrl}auth/login`, data);
  }

  signup(data: object) {
    return this.http.put(`${this.apiUrl}auth/signup`, data);
  }

  isAuthenticated(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false; // Or handle the case where localStorage is not available
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
