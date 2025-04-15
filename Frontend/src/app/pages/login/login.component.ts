import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service'; // AuthService importálása
import { Router } from '@angular/router'; // Router importálása

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent {
  email: string = ''; // Az email mező
  password: string = ''; // A password mező
  errorMessage: string = ''; // Hibaüzenet változó

  constructor(
    private authService: AuthService, // Az AuthService injektálása
    private router: Router // A Router szolgáltatás injektálása
  ) {}

  // Bejelentkezés
  onLogin() {
    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials.email, credentials.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/profile']); // Átirányítás a profil oldalra
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Hibás email vagy jelszó!'; // Hibaüzenet beállítása
      }
    );
  }
}
