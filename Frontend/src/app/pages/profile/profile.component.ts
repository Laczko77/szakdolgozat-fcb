import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';  // Importáljuk az AuthService-t
import { Router } from '@angular/router'; // A Router szolgáltatás importálása

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  errorMessage: string = ''; // Hibaüzenet változó

  constructor(
    private authService: AuthService,
    private router: Router // Router szolgáltatás injektálása
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  // Felhasználói adatok betöltése
  loadUserData() {
    if (this.authService.isAuthenticated()) {
      const token = localStorage.getItem('token');
      if (token) {
        // Ha a token létezik, a backendről kellene lekérni az adatokat
        this.authService.getUserData()?.subscribe(
          (userData) => {
            this.username = userData.username;
            this.email = userData.email;
          },
          (error) => {
            console.error('Error loading user data', error);
            this.errorMessage = 'Nem sikerült betölteni a felhasználói adatokat!'; // Hibaüzenet beállítása
          }
        );
      } else {
        this.errorMessage = 'Nincs érvényes token!';
      }
    } else {
      this.router.navigate(['/login']); // Ha nincs token, átirányítás a login oldalra
    }
  }

  // Kijelentkezés funkció
  logout() {
    this.authService.logout();  // A logout metódus meghívása
    this.router.navigate(['/login']); // Átirányítás a bejelentkezési oldalra
  }
}
