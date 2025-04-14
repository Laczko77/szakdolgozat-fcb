import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component'; // Profile importálása
import { AuthGuard } from '../shared/services/auth.guard';// AuthGuard importálása
import { HomeComponent } from './pages/main/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },  // Ezt elhagyhatod, mert az AppComponent alapértelmezett
  { path: 'login', component: LoginComponent},  // Ha be van jelentkezve, átirányítjuk a profil oldalra
  { path: 'register', component: RegisterComponent },  // Ha be van jelentkezve, átirányítjuk a profil oldalra
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },  // Profile oldal védelme
  { path: '**', redirectTo: '/login' }  // Hibás útvonalak kezelése
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

