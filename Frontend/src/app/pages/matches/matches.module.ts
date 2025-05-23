import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchAdminComponent } from './match-admin/match-admin.component';
import { MatchListComponent } from './match-list/match-list.component';
import { TicketPurchaseComponent } from './ticket-purchase/ticket-purchase.component';
import { MatchesRoutingModule } from './matches-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MatchAdminComponent,
    MatchListComponent,
    TicketPurchaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatchesRoutingModule
  ]
})
export class MatchesModule {}
