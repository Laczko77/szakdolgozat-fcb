import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  standalone: false
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { username: string; score: number }[] = [];
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
      },
      error: (err) => {
        console.error('Hiba a leaderboard lekérésekor:', err);
        this.errorMessage = 'Nem sikerült betölteni a toplistát.';
      }
    });
  }
}
