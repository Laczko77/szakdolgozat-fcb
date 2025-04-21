import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const isAdminOnly = route.data['adminOnly'] === true;
    const isAdmin = this.authService.isAdmin();

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    if (isAdminOnly && !isAdmin) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
