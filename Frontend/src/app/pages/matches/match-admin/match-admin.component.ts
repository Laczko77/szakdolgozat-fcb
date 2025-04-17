// match-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { MatchService, Match } from '../../../../shared/services/match.service';

@Component({
  selector: 'app-match-admin',
  templateUrl: './match-admin.component.html',
  styleUrls: ['./match-admin.component.scss'],
  standalone: false
})
export class MatchAdminComponent implements OnInit {
  matches: Match[] = [];
  newMatch: Match = {
    date: '',
    competition: '',
    matchday: '',
    opponent: '',
    home: 'home',
    score: ''
  };
  editingMatch: Match | null = null;

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.matchService.getAll().subscribe(matches => this.matches = matches);
  }

  saveMatch(): void {
    const request = this.editingMatch
      ? this.matchService.update(this.editingMatch._id!, this.newMatch)
      : this.matchService.create(this.newMatch);

    request.subscribe(() => {
      this.resetForm();
      this.loadMatches();
    });
  }

  editMatch(match: Match): void {
    this.editingMatch = match;
    this.newMatch = { ...match };
  }

  deleteMatch(id: string): void {
    if (confirm('Biztosan törlöd a meccset?')) {
      this.matchService.delete(id).subscribe(() => {
        this.loadMatches();
      });
    }
  }

  resetForm(): void {
    this.newMatch = {
      date: '',
      competition: '',
      matchday: '',
      opponent: '',
      home: 'home',
      score: ''
    };
    this.editingMatch = null;
  }
}
