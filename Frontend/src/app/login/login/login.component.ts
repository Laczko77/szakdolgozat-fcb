import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = ''; // Az email mezőt használd
  password: string = '';

  constructor(private userService: UserService) {}

  onLogin() {
    const credentials = { email: this.email, password: this.password }; // Az email mező maradjon
    this.userService.login(credentials).subscribe(
      (response) => {
        console.log('Login successful:', response);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }
}

