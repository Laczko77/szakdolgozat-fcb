import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users'; // Backend API URL
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

  // Regisztráció
  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  // Bejelentkezés
  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
        this.router.navigate(['/dashboard']); // Átirányítás a védett oldalra
      });
  }

  // Kilépés
  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Bejelentkezett felhasználó tokenje
  get token() {
    return this.tokenSubject.asObservable();
  }

  // Ellenőrzés, hogy a felhasználó be van-e jelentkezve
  isAuthenticated() {
    return !!this.tokenSubject.value;
  }
}
