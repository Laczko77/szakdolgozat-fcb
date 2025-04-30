import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  username: string | null = '';
  cartItemCount: number = 0;

  constructor(private authService: AuthService,private cartService: CartService) {}

  ngOnInit(): void {
    this.authService.authStatus$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.isAdmin = this.authService.isAdmin();
      this.username = this.authService.getUsername();
    });
  
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    });
    
  }
  
}
