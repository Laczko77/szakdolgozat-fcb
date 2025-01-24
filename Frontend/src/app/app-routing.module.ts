import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register/register.component';  // Regisztrációs komponens importálása
import { LoginComponent } from './login/login/login.component';  // Bejelentkezési komponens importálása

const routes: Routes = [
  { path: '', component: AppComponent },  // Alapértelmezett útvonal
  { path: 'register', component: RegisterComponent },  // Regisztrációs útvonal
  { path: 'login', component: LoginComponent },  // Bejelentkezési útvonal
  // Egyéb útvonalak
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

