import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  username: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authStatus$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.isAdmin = this.authService.isAdmin();
      this.username = this.authService.getUsername();
    });
  }
}
