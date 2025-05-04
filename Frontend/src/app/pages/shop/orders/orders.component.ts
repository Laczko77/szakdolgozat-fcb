// orders.component.ts
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef  } from '@angular/core';
import { OrderService, Order, ProductOrderItem } from '../../../../shared/services/order.service';
import { TicketService, TicketResponse } from '../../../../shared/services/ticket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: false
})
export class OrdersComponent implements OnInit, AfterViewInit {
  orders: Order[] = [];
  tickets: TicketResponse[] = [];
  items: ProductOrderItem[] = [];
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

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

  loadOrders(): void {
    this.orderService.getMyOrders().subscribe(orders => this.orders = orders);
  }

  loadTickets(): void {
    this.ticketService.getMyTickets().subscribe(tickets => this.tickets = tickets);
  }

  toggleView(): void {
    this.showTickets = !this.showTickets;
  }

  getOrderTotal(order: any): number {
    return order.items.reduce((sum: number, item: any) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);
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
