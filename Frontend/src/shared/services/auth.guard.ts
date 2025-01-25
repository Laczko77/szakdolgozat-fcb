import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Ha a felhasználó be van jelentkezve, engedjük a hozzáférést
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Ha nincs bejelentkezve, átirányítjuk a login oldalra
      this.router.navigate(['/login']);
      return false;
    }
  }

  
}

