import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms'; // Importálni kell

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private http: HttpClient) {}

  // Módosított onSubmit, hogy fogadja a form-ot
  onSubmit(registerForm: NgForm) {
    if (registerForm.valid) {
      const user = registerForm.value; // Form adatainak lekérése

      this.http.post('http://localhost:3000/api/users/register', user)
        .subscribe(
          (response) => {
            console.log('Registration successful:', response);
            // További teendők, például átirányítás vagy üzenet megjelenítése
          },
          (error) => {
            console.error('There was an error!', error);
          }
        );
    }
  }
}

