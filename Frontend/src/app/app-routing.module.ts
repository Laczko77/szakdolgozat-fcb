import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component'; // Profile importálása
import { AuthGuard } from '../shared/services/auth.guard';// AuthGuard importálása



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  {
    path: 'home',
    loadChildren: () => import('./pages/news/news.module').then(m => m.NewsModule)
  }
,  
  
  {
    path: 'shop',
    loadChildren: () => import('./pages/shop/shop.module').then(m => m.ShopModule)
  },
  
  
  {
    path: 'players',
    loadChildren: () => import('./pages/squad/squad.module').then(m => m.SquadModule)
  },
  
  {
    path: 'matches',
    loadChildren: () => import('./pages/matches/matches.module').then(m => m.MatchesModule)
  },
  

  {
    path: 'polls',
    loadChildren: () => import('./pages/polls/polls.module').then(m => m.PollsModule)
  },
  
  {
    path: 'forum',
    loadChildren: () => import('./pages/forum/forum.module').then(m => m.ForumModule)
  }
  ,

  { path: '**', redirectTo: '/home' },
  
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

