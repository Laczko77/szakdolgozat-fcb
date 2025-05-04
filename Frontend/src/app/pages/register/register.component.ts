import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';  // Importáljuk a Router-t
import { AnalyticsService } from '../../../shared/services/analytics.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent {

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private analyticsService: AnalyticsService) {}  // A Router szolgáltatás hozzáadása


  onButtonClick() {
    this.analyticsService.sendButtonClick('Regisztráció');
  }
  // Módosított onSubmit
  onSubmit(registerForm: NgForm) {
    if (registerForm.valid) {
      const user = registerForm.value;
  
      this.authService.register(user.username, user.email, user.password)
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: () => {
            // Itt nem kell semmi, a service automatikusan snackBar-t mutat
          }
        });
    }
  }
}

