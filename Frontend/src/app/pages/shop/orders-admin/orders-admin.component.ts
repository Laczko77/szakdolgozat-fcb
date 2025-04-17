import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../shared/services/order.service';

@Component({
  selector: 'app-orders-admin',
  templateUrl: './orders-admin.component.html',
  styleUrls: ['./orders-admin.component.scss'],
  standalone: false
})
export class OrdersAdminComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res) => this.orders = res,
      error: (err) => console.error('Hiba a rendelések lekérdezésekor:', err)
    });
  }

  markAsCompleted(orderId: string): void {
    this.orderService.updateOrderStatus(orderId, 'Teljesítve').subscribe(() => {
      this.loadOrders();
    });
  }

  deleteOrder(orderId: string): void {
    if (confirm('Biztosan törölni szeretnéd ezt a rendelést?')) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        this.loadOrders();
      });
    }
  }
}
