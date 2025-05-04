// ticket-purchase.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService,Match } from '../../../../shared/services/match.service';
import { TicketService } from '../../../../shared/services/ticket.service';
import { AnalyticsService } from '../../../../shared/services/analytics.service';

@Component({
  selector: 'app-ticket-purchase',
  templateUrl: './ticket-purchase.component.html',
  styleUrls: ['./ticket-purchase.component.scss'],
  standalone: false
})
export class TicketPurchaseComponent implements OnInit {
  match: Match | null = null;
  ticketQuantities: { [key: string]: number } = {
    cat1: 0,
    cat2: 0,
    cat3: 0,
    vip: 0
  }; 

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private ticketService: TicketService,
    private router: Router,
    private analyticsService: AnalyticsService
  ) {}

  onButtonClick() {
    this.analyticsService.sendButtonClick('Jegy megvásárlása');
  }

  ngOnInit(): void {
    const matchId = this.route.snapshot.paramMap.get('id');
    if (matchId) {
      this.matchService.getAll().subscribe(matches => {
        this.match = matches.find(m => m._id === matchId) || null;
      });
    }
  }

  adjustQuantity(category: string, change: number): void {
    const current = this.ticketQuantities[category];
    this.ticketQuantities[category] = Math.max(0, current + change);
  }

  get totalTickets(): number {
    return Object.values(this.ticketQuantities).reduce((sum, qty) => sum + qty, 0);
  }

  submitOrder(): void {
    const selectedTickets = Object.entries(this.ticketQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([category, quantity]) => ({ category, quantity }));

    if (this.match && selectedTickets.length > 0) {
      this.ticketService.createTicketOrder({
        matchId: this.match._id!,
        tickets: selectedTickets
      }).subscribe(() => {
        this.router.navigate(['/orders'], { queryParams: { tickets: true } });

      });
    }
  }
}