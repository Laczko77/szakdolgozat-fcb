import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service'; // AuthService importálása
import { Router } from '@angular/router'; // Router importálása
import { AnalyticsService } from '../../../shared/services/analytics.service';
import { HttpClient } from '@angular/common/http'; // HTTP kérésekhez
declare const google: any; // Google API globális deklarációja

@Component({
    selector: 'app-login', 
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {
  email: string = ''; // Az email mező
  password: string = ''; // A password mező
  errorMessage: string = ''; // Hibaüzenet változó

  constructor(
    private authService: AuthService,
    private router: Router,
    private analyticsService: AnalyticsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '346108805116-bkqslvfiof5kl2odkqim4779lorqs5og.apps.googleusercontent.com', // <-- a Te Client ID-d
      callback: (response: any) => this.handleGoogleResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      { theme: 'outline', size: 'large' }
    );
  }

  onButtonClick() {
    this.analyticsService.sendButtonClick('Bejelentkezés');
  }

  onLogin() {
    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials.email, credentials.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Hibás email vagy jelszó!';
      }
    );
  }

  handleGoogleResponse(response: any) {
    const credential = response.credential;
  
    this.http.post<any>('http://localhost:3000/api/users/google-login', { token: credential })
      .subscribe(
        (res) => {
          console.log('Google login sikeres:', res);
          localStorage.setItem('token', res.token);
  
          // 🔥 TokenSubject frissítése
          this.authService['tokenSubject'].next(res.token);
  
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 100); 
        },
        (err) => {
          console.error('Google login hiba:', err);
          this.errorMessage = 'Google bejelentkezés sikertelen!';
        }
      );
  }
  
}  
