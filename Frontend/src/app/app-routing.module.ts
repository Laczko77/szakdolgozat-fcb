import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';  // Hozzáadott komponens például
import { RegisterComponent } from './register/register/register.component';

const routes: Routes = [
  { path: '', component: AppComponent },  // Alapértelmezett útvonal
  { path: 'register', component: RegisterComponent },  // Regisztrációs útvonal
  // Egyéb útvonalak
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
