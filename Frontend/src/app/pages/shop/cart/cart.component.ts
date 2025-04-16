import { Component, OnInit } from '@angular/core';
import { CartService, Cart } from '../../../../shared/services/cart.service';
import { OrderService } from '../../../../shared/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  orderPlaced: boolean = false;
  
  constructor(private cartService: CartService,private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => console.error('Hiba a kosár lekérdezésénél:', err)
    });
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.loadCart();
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe(() => {
      this.loadCart();
    });
  }

  decreaseItem(productId: string): void {
    this.cartService.decreaseQuantity(productId).subscribe(() => {
      this.loadCart();
    });
  }

  placeOrder(): void {
    this.orderService.placeOrder().subscribe({
      next: (res) => {
        this.loadCart(); // frissíti az üres kosarat
        this.orderPlaced = true; // új!
      },
      error: (err) => {
        console.error('Hiba a rendelés során:', err);
        alert('Hiba történt a rendelés leadásakor.');
      }
    });
  }
}
