import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop/shop.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShopRoutingModule } from './shop-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductAdminComponent } from './product-admin/product-admin.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { OrdersAdminComponent } from './orders-admin/orders-admin.component';

@NgModule({
  declarations: [
    ShopComponent,
    ProductDetailComponent,
    ProductAdminComponent,
    CartComponent,
    OrdersComponent,
    OrdersAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShopRoutingModule
  ]
})
export class ShopModule {}
