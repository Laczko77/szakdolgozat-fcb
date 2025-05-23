import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router'; // ➕ ActivatedRoute importálva
import { AnalyticsService } from '../../../shared/services/analytics.service';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  returnUrl: string = '/profile'; // ➕ returnUrl mező

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute, // ➕ ActivatedRoute konstruktorban
    private analyticsService: AnalyticsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0 });

    // ➕ returnUrl kiolvasása query paraméterből
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';

    google.accounts.id.initialize({
      client_id: '346108805116-bkqslvfiof5kl2odkqim4779lorqs5og.apps.googleusercontent.com',
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
        this.router.navigateByUrl(this.returnUrl); 
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Hibás email vagy jelszó!';
      }
    );
  }

  handleGoogleResponse(response: any) {
    const credential = response.credential;

    this.http.post<any>('https://szakdolgozat-fcb.onrender.com/api/users/google-login', { token: credential })
      .subscribe(
        (res) => {
          console.log('Google login sikeres:', res);
          localStorage.setItem('token', res.token);

          this.authService['tokenSubject'].next(res.token);

          setTimeout(() => {
            this.router.navigateByUrl(this.returnUrl);
          }, 100);
        },
        (err) => {
          console.error('Google login hiba:', err);
          this.errorMessage = 'Google bejelentkezés sikertelen!';
        }
      );
  }
}
