import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component'; // Profile importálása
import { AuthGuard } from '../shared/services/auth.guard';// AuthGuard importálása
import { HomeComponent } from './pages/main/home/home.component';
import { NewsDetailComponent } from './pages/news/news-detail/news-detail.component';
import { NewsCreateComponent } from './pages/news/news-create/news-create.component';
import { ProductAdminComponent } from './pages/shop/product-admin/product-admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'news/create', component: NewsCreateComponent },
  { path: 'news/:id', component: NewsDetailComponent },
  { path: 'shop/admin', component: ProductAdminComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

