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
import { ShopComponent } from './pages/shop/shop/shop.component';
import { ProductDetailComponent } from './pages/shop/product-detail/product-detail.component';
import { CartComponent } from './pages/shop/cart/cart.component';
import { OrdersComponent } from './pages/shop/orders/orders.component';
import { OrdersAdminComponent } from './pages/shop/orders-admin/orders-admin.component';
import { MatchAdminComponent } from './pages/matches/match-admin/match-admin.component';
import { MatchListComponent } from './pages/matches/match-list/match-list.component';
import { PlayerAdminComponent } from './pages/squad/player-admin/player-admin.component';
import { PlayerListComponent } from './pages/squad/player-list/player-list.component';
import { TicketPurchaseComponent } from './pages/matches/ticket-purchase/ticket-purchase.component';
import { ForumComponent } from './pages/forum/forum/forum.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'news/create', component: NewsCreateComponent },
  { path: 'news/:id', component: NewsDetailComponent },
  { path: 'shop/admin', component: ProductAdminComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'admin/orders', component: OrdersAdminComponent },
  { path: 'admin/matches', component: MatchAdminComponent },
  { path: 'matches', component: MatchListComponent },
  { path: 'admin/players', component: PlayerAdminComponent },
  { path: 'players', component: PlayerListComponent },
  { path: 'tickets/purchase/:id', component: TicketPurchaseComponent },
  { path: 'forum', component: ForumComponent, canActivate: [AuthGuard] }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

