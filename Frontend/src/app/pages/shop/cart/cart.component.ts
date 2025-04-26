import { Component, OnInit } from '@angular/core';
import { CartService, Cart, CartItem } from '../../../../shared/services/cart.service';
import { OrderService } from '../../../../shared/services/order.service';
import { PlayerService } from '../../../../shared/services/player.service';
import { sendOrderEmail } from '../../../../shared/services/email.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { AnalyticsService } from '../../../../shared/services/analytics.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  orderPlaced: boolean = false;

  
  constructor(private cartService: CartService,private orderService: OrderService, private playerService: PlayerService, private authService: AuthService,private analyticsService: AnalyticsService) {}

  onButtonClick() {
    this.analyticsService.sendButtonClick('Termék/ek megvásárlása');
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadPlayersForCartItems(): void {
    if (!this.cart) return;
  
    console.log('Kosár elemek betöltése előtt:', this.cart.items);
  
    for (const item of this.cart.items) {
      if (item.player) {
        console.log('Lekérdezzük a játékos adatot ehhez az ID-hoz:', item.player);
        this.playerService.getPlayerById(item.player as unknown as string).subscribe({
          next: (playerData) => {
            console.log('Sikeres játékos lekérés:', playerData);
            (item.player as any) = playerData;
          },
          error: (err) => console.error('Hiba a játékos adatainak lekérdezésekor:', err)
        });
      } else {
        console.log('Nincs player az itemben:', item);
      }
    }
  
    console.log('Kosár elemek betöltése után:', this.cart.items);
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loadPlayersForCartItems();
      },
      error: (err) => console.error('Hiba a kosár lekérdezésekor:', err)
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

  decreaseItem(item: CartItem): void {
    this.cartService.decreaseQuantity(item.productId._id, item.size, item.player?._id).subscribe(() => {
      this.loadCart();
    });
  }
  

  placeOrder(): void {
    this.authService.getUserData()?.subscribe({
      next: (user) => {
        if (!user) {
          console.error('❌ Nincs bejelentkezett felhasználó.');
          return;
        }
  
        this.orderService.placeOrder().subscribe({
          next: (createdOrder) => {
            console.log('✅ Rendelés sikeresen leadva:', createdOrder);
  
            const orderData = {
              order_id: createdOrder.order?._id || '',
              email: user.email || '',
              orders: createdOrder.order?.items.map((item: any) => ({
                image_url: item.imageUrl || '',           // ➔ közvetlenül az Orderből
                name: item.name || 'Termék',               // ➔ közvetlenül az Orderből
                units: item.quantity,
                price: item.price || 0,
                size: item.size || '-',
                player: item.player?.name || '-'
              })) || [],
              cost: {
                total: createdOrder.order?.totalAmount || 0
              }
            };
  
            console.log('📦 Email küldésre előkészített adatok:', orderData);
  
            sendOrderEmail(orderData)
              .then(() => {
                console.log('✅ Email sikeresen elküldve!');
                this.loadCart(); // Kosár ürítése
                this.orderPlaced = true;
              })
              .catch((error) => {
                console.error('❌ Hiba az email küldés közben:', error);
              });
          },
          error: (err) => {
            console.error('❌ Hiba a rendelés leadásakor:', err);
            alert('Hiba történt a rendelés leadása közben.');
          }
        });
      },
      error: (err) => {
        console.error('❌ Hiba a felhasználói adat lekérdezésekor:', err);
      }
    });
  }
  
  
  

  
  
  
  
  


}
