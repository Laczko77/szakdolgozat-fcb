import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../shared/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: false
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => this.orders = orders,
      error: (err) => console.error('Hiba a rendelések lekérdezésekor:', err)
    });
  }
}
