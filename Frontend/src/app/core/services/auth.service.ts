import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Signal for reactive state management
  currentUser = signal<any>(null);

  constructor() {
    this.loadUserFromToken();
  }

  login(credentials: any) {
    return this.http
      .post<{ message: string; data: string }>(`${this.apiUrl}/user/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.data) {
            this.setToken(response.data);
          }
        }),
      );
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      this.loadUserFromToken();
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private loadUserFromToken() {
    const token = this.getToken();
    if (token) {
      const decodedUser = parseJwt(token);
      this.currentUser.set(decodedUser);
    }
  }
}
