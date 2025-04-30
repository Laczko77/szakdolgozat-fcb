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
  searchTerm: string = '';
  selectedPosition: string = '';
  filteredPlayers: Player[] = [];
  selectedFile: File | null = null;

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
    this.playerService.getAll().subscribe(players => {
      this.players = players;
      this.applyFilters(); // új
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  applyFilters(): void {
    this.filteredPlayers = this.players.filter(player =>
      player.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedPosition === '' || player.position === this.selectedPosition)
    );
  }

  savePlayer(): void {
    const formData = new FormData();
    const playerData = this.newPlayer as any;

    for (const key in playerData) {
      if (playerData[key] !== undefined && playerData[key] !== null) {
        formData.append(key, playerData[key]);
      }
    }
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    const request = this.editingPlayer
      ? this.playerService.update(this.editingPlayer._id!, formData)
      : this.playerService.create(formData);
  
    request.subscribe(() => {
      this.resetForm();
      this.loadPlayers();
      this.selectedFile = null;
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

  onSearchChange(): void {
    this.applyFilters();
  }
  
  onPositionChange(): void {
    this.applyFilters();
  }
}