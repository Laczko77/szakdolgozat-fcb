import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchAdminComponent } from './match-admin/match-admin.component';
import { MatchListComponent } from './match-list/match-list.component';
import { TicketPurchaseComponent } from './ticket-purchase/ticket-purchase.component';
import { AuthGuard } from '../../../shared/services/auth.guard';

const routes: Routes = [
  { path: '', component: MatchListComponent }, // /matches
  { path: 'admin', component: MatchAdminComponent, canActivate: [AuthGuard], data: { adminOnly: true } },
  { path: 'tickets/purchase/:id', component: TicketPurchaseComponent, canActivate: [AuthGuard] } // path korrekció Angular miatt
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchesRoutingModule {}
