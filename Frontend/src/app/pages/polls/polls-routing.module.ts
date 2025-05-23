import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PollUserComponent } from './poll-user/poll-user.component';
import { PollAdminComponent } from './poll-admin/poll-admin.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AuthGuard } from '../../../shared/services/auth.guard';

const routes: Routes = [
  { path: '', component: PollUserComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: PollAdminComponent, canActivate: [AuthGuard], data: { adminOnly: true } },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PollsRoutingModule {}
