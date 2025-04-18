import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators'; // Az error kezelést és az 'tap' operátort hozzáadtam

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users'; // Backend API URL
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

  // Regisztrációs metódus
  register(username: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password })
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          throw error; // Hiba esetén a hiba tovább dobása
        })
      ); 
  } 

  // Bejelentkezés
  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // A token elmentése és az autentikáció frissítése
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error; // Hiba esetén a hiba tovább dobása
        })
      );
  }

  getUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      // Mivel a token már a localStorage-ban van, ezt kell küldeni a backend-nek
      return this.http.get<any>(`${this.apiUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return null;  // Ha nincs token, ne történjen semmi
  }

  // Kilépés
  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']); // Kilépés után átirányítás a login oldalra
  }

  // Bejelentkezett felhasználó tokenje
  get token() {
    return this.tokenSubject.asObservable();
  }

  // Ellenőrzés, hogy a felhasználó be van-e jelentkezve
  isAuthenticated() {
    return !!this.tokenSubject.value;
  }

  getUsername(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username;
    } catch (err) {
      console.error('Hibás token vagy nem tartalmaz username mezőt');
      return null;
    }
  }
}
