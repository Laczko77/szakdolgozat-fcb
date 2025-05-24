import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CartService, Cart, CartItem } from '../../../../shared/services/cart.service';
import { OrderService } from '../../../../shared/services/order.service';
import { PlayerService } from '../../../../shared/services/player.service';
import { sendOrderEmail } from '../../../../shared/services/email.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { AnalyticsService } from '../../../../shared/services/analytics.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent implements OnInit, AfterViewInit {
  cart: Cart | null = null;
  orderPlaced: boolean = false;
  shippingForm: FormGroup;
  isShippingModalOpen = false;
  isSubmitting = false;
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;
  
  constructor(private fb: FormBuilder, private cartService: CartService,private orderService: OrderService, private playerService: PlayerService, private authService: AuthService,private analyticsService: AnalyticsService) {
    this.shippingForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      city: ['', Validators.required],
      street: ['', Validators.required],
      floor: [''] // opcionális
    });
  }

  onButtonClick() {
    this.analyticsService.sendButtonClick('Termék/ek megvásárlása');
  }

  ngOnInit(): void {
    this.loadCart();
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
        
      });
    }, {
      threshold: 0.08
    });

    this.fadeElements.changes.subscribe((elements: QueryList<ElementRef>) => {
      elements.forEach((el) => observer.observe(el.nativeElement));
    });

    // Azonnal is lefuttatjuk, ha már van elem
    this.fadeElements.forEach((el) => observer.observe(el.nativeElement));
  }
  
  openShippingModal() {
    this.isShippingModalOpen = true;
  }
  
  closeShippingModal() {
    this.isShippingModalOpen = false;
  }
  
  submitShippingAndOrder() {
    if (this.shippingForm.invalid) return;
  
    const shippingData = this.shippingForm.value;
    console.log('Szállítási adatok:', shippingData);
  
    this.placeOrder(); // meglévő rendeléslogika
    this.shippingForm.reset();
    this.closeShippingModal();
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

  removeItem(item: any) {
    const productId = item.productId._id;
    const size = item.size;
    const playerId = item.player?._id;
  
    this.cartService.removeFromCart(productId, size, playerId).subscribe({
      next: cart => {
        this.cart = cart;
      },
      error: err => {
        console.error('Hiba a tétel törlésekor:', err);
      }
    });
  }
  
  
  

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.loadCart(); // ✅
      this.cartService.refreshCart(); // ✅ Új sor
    });
  }

  decreaseItem(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.decreaseQuantity(
        item.productId._id,
        item.size,
        item.player?._id
      ).subscribe(() => {
        this.loadCart();
        this.cartService.refreshCart(); // frissíti a badge-et is
      });
      
    } else {
      this.removeItem(item);
    }
  }

  increaseItem(item: any) {
    const productId = item.productId._id;
    const quantity = 1;
    const size = item.size;
    const playerId = item.player?._id;
  
    this.cartService.addToCart(productId, quantity, size, playerId).subscribe({
      next: updatedCart => {
        this.cart = updatedCart;
      },
      error: err => {
        console.error('Hiba a mennyiség növelésekor', err);
      }
    });
  }
  
  

  get totalPrice(): number {
    if (!this.cart || !this.cart.items) return 0;
    return this.cart.items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);
  }

  get totalQuantity(): number {
    return this.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
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
                image_url: item.imageUrl || '',           
                name: item.name || 'Termék',               
                units: item.quantity,
                price: item.price || 0,
                size: item.size || '-',
                player: item.player?.name || '-'
              })) || [],
              cost: {
                total: createdOrder.order?.totalAmount || 0
              }
              
            };
            console.log('Orders részletesen:', orderData.orders);
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
