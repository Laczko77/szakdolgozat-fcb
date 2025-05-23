import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerAdminComponent } from './player-admin/player-admin.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { AuthGuard } from '../../../shared/services/auth.guard';

const routes: Routes = [
  { path: '', component: PlayerListComponent }, // /players
  { path: 'admin', component: PlayerAdminComponent, canActivate: [AuthGuard], data: { adminOnly: true } } // /players/admin
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SquadRoutingModule {}
