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
  private loading = true; // Loading state to track authentication status check

  constructor() {
    this.checkAuthentication(); // Check authentication status on service initialization
  }

  http = inject(HttpClient);
  router = inject(Router);

  // Simulate checking authentication status
  private checkAuthentication() {
    // Simulate a delay for checking authentication status
    setTimeout(() => {
      this.loading = false; // Set loading to false after the check
    }, 100); // Simulated delay
  }

  login(data: object) {
    return this.http.post(`${this.apiUrl}auth/login`, data);
  }

  signup(data: object): Observable<any> {
    return this.http.put(`${this.apiUrl}auth/signup`, data);
  }

  updateUser(data: object, id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}auth/user/${id}`, data);
  }

  getuser(): Observable<any> {
    return this.http.get(`${this.apiUrl}auth/user`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}auth/user/${id}`);
  }

  isAuthenticated(): boolean {
    // Check if localStorage is available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false; // Not authenticated if localStorage is not available
  }

  isLoading(): boolean {
    return this.loading;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
