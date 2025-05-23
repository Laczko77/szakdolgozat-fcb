import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/users';
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  authStatus$ = this.tokenSubject.asObservable().pipe(map(token => !!token));

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandler: HttpErrorHandlerService
  ) {}

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
      }),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  get token() {
    return this.tokenSubject.asObservable();
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  isAuthenticated() {
    return !!this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    } catch {
      return false;
    }
  }

  getUsername(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username;
    } catch {
      return null;
    }
  }
  
  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch {
      return null;
    }
  }
  


  getUserData(): Observable<any> | null {
    const token = localStorage.getItem('token');
    if (token) {
      return this.http.get<any>(`${this.apiUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      }).pipe(
        catchError(err => this.errorHandler.handleError(err))
      );
    }
    return null;
  }

  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard`).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  
  
}
