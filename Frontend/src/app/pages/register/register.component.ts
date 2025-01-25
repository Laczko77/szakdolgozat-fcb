import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';  // Importáljuk a Router-t

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private http: HttpClient, private router: Router) {}  // A Router szolgáltatás hozzáadása

  // Módosított onSubmit
  onSubmit(registerForm: NgForm) {
    if (registerForm.valid) {
      const user = registerForm.value;  // Form adatainak lekérése

      this.http.post('http://localhost:3000/api/users/register', user)
        .subscribe(
          (response) => {
            console.log('Registration successful:', response);
            // Sikeres regisztráció után átirányítás a /login oldalra
            this.router.navigate(['/login']);  // Itt történik az átirányítás
          },
          (error) => {
            console.error('There was an error!', error);
          }
        );
    }
  }
}

