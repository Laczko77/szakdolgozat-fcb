import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: false
})
export class MenuComponent {
  // A token observable figyelése
  isAuthenticated$ = this.authService.token;

  constructor(private authService: AuthService, private router: Router) {}

  
}

