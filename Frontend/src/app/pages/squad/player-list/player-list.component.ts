
import { Component, OnInit } from '@angular/core';
import { PlayerService, Player } from '../../../../shared/services/player.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
  standalone: false
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.getAll().subscribe(players => {
      this.players = players;
    });
  }
}

