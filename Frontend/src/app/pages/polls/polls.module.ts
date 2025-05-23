import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PollsRoutingModule } from './polls-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PollUserComponent } from './poll-user/poll-user.component';
import { PollAdminComponent } from './poll-admin/poll-admin.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@NgModule({
  declarations: [
    PollUserComponent,
    PollAdminComponent,
    LeaderboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PollsRoutingModule
  ]
})
export class PollsModule {}
