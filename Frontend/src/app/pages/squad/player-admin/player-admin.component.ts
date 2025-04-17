// player-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { PlayerService, Player } from '../../../../shared/services/player.service';

@Component({
  selector: 'app-player-admin',
  templateUrl: './player-admin.component.html',
  styleUrls: ['./player-admin.component.scss'],
  standalone: false
})
export class PlayerAdminComponent implements OnInit {
  players: Player[] = [];
  newPlayer: Player = this.createEmptyPlayer();
  editingPlayer: Player | null = null;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  createEmptyPlayer(): Player {
    return {
      name: '',
      number: 0,
      position: '',
      nationality: '',
      birthDate: '',
      imageUrl: '',
      appearances: 0,
      goals: 0,
      assists: 0,
      isCoach: false
    };
  }

  loadPlayers(): void {
    this.playerService.getAll().subscribe(players => this.players = players);
  }

  savePlayer(): void {
    const request = this.editingPlayer
      ? this.playerService.update(this.editingPlayer._id!, this.newPlayer)
      : this.playerService.create(this.newPlayer);

    request.subscribe(() => {
      this.resetForm();
      this.loadPlayers();
    });
  }

  editPlayer(player: Player): void {
    this.editingPlayer = player;
    this.newPlayer = { ...player };
  }

  deletePlayer(id: string): void {
    if (confirm('Biztosan törölni szeretnéd ezt a játékost?')) {
      this.playerService.delete(id).subscribe(() => {
        this.loadPlayers();
      });
    }
  }

  resetForm(): void {
    this.newPlayer = this.createEmptyPlayer();
    this.editingPlayer = null;
  }
}