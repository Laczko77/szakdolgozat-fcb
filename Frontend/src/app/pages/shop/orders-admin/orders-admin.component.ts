import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../shared/services/order.service';
import { PlayerService } from '../../../../shared/services/player.service';
import { sendOrderCompletedEmail } from '../../../../shared/services/email.service';

@Component({
  selector: 'app-orders-admin',
  templateUrl: './orders-admin.component.html',
  styleUrls: ['./orders-admin.component.scss'],
  standalone: false
})
export class OrdersAdminComponent implements OnInit {
  orders: any[] = [];
  selectedStatus: string = 'all';

  constructor(private orderService: OrderService,private playerService: PlayerService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadPlayersForOrders(): void {
    for (const order of this.orders) {
      for (const item of order.items) {
        if (item.player && item.player._id) {
          this.playerService.getPlayerById(item.player._id).subscribe({
            next: (playerData) => {
              item.player = {
                _id: playerData._id,
                name: playerData.name
              };
            },
            error: (err) => console.error('Hiba a játékos adatainak lekérdezésekor:', err)
          });
        }
      }
    }
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loadPlayersForOrders(); // <- új
      },
      error: (err) => console.error('Hiba a rendelések lekérdezésekor:', err)
    });
  }

  markAsCompleted(orderId: string) {
    this.orderService.updateOrderStatus(orderId, 'Teljesítve').subscribe({
      next: (updatedOrder) => {
        console.log('✅ Rendelés teljesítve:', updatedOrder);
        
        if (updatedOrder?.userId?.email) {
          const emailData = {
            email: updatedOrder.userId.email,
            order_id: updatedOrder._id,
          };
  
          sendOrderCompletedEmail(emailData)
            .then(() => {
              console.log('📩 Teljesítés email sikeresen elküldve!');
            })
            .catch((error) => {
              console.error('❌ Hiba a teljesítés email küldésekor:', error);
            });
        }
  
        this.loadOrders(); // frissítjük a listát
      },
      error: (err) => {
        console.error('❌ Hiba a rendelés státusz frissítésekor:', err);
      }
    });
  }

  deleteOrder(orderId: string): void {
    if (confirm('Biztosan törölni szeretnéd ezt a rendelést?')) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        this.loadOrders();
      });
    }
  }

  get filteredOrders(): any[] {
    if (this.selectedStatus === 'all') {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.selectedStatus);
  }
}
