// orders.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../../../shared/services/order.service';
import { TicketService, TicketResponse } from '../../../../shared/services/ticket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: false
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  tickets: TicketResponse[] = [];
  showTickets = false;

  constructor(
    private orderService: OrderService,
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const show = this.route.snapshot.queryParamMap.get('tickets');
    this.showTickets = show === 'true';
    this.loadOrders();
    this.loadTickets();
  }

  loadOrders(): void {
    this.orderService.getMyOrders().subscribe(orders => this.orders = orders);
  }

  loadTickets(): void {
    this.ticketService.getMyTickets().subscribe(tickets => this.tickets = tickets);
  }

  toggleView(): void {
    this.showTickets = !this.showTickets;
  }

  formatTeams(match: any): string {
    if (match.home === 'home') {
      return `FC Barcelona vs ${match.opponent}`;
    } else if (match.home === 'away') {
      return `${match.opponent} vs FC Barcelona`;
    } else {
      return `FC Barcelona vs ${match.opponent}`;
    }
  }
}
