import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductAdminComponent } from './product-admin/product-admin.component';
import { AuthGuard } from '../../../shared/services/auth.guard'; // útvonalat igazítsd
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersAdminComponent } from './orders-admin/orders-admin.component';

const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: ProductAdminComponent, canActivate: [AuthGuard], data: { adminOnly: true } },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'admin/orders', component: OrdersAdminComponent, canActivate: [AuthGuard], data: { adminOnly: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {}
