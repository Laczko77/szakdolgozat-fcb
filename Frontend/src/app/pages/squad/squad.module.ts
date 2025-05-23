import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerAdminComponent } from './player-admin/player-admin.component';
import { PlayerListComponent } from './player-list/player-list.component';
import { SquadRoutingModule } from './squad-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PlayerAdminComponent,
    PlayerListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SquadRoutingModule
  ]
})
export class SquadModule {}
