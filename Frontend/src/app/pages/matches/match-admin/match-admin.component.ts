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
  searchTerm: string = '';
  selectedTournament: string = '';
  filteredMatches: Match[] = [];

  availableTournaments: string[] = [ 
    'La Liga',
    'Bajnokok Ligája',
    'Copa del Rey',
    'Szuperkupa'
  ];

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
    this.matchService.getAll().subscribe(matches => {
      this.matches = matches;
      this.applyFilters();
    });
  }
  
  applyFilters(): void {
    this.filteredMatches = this.matches.filter(match =>
      match.opponent.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedTournament === '' || match.competition === this.selectedTournament)
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }
  
  onTournamentChange(): void {
    this.applyFilters();
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
  
    // Biztonságos másolás, hogy az ngModel reagáljon
    this.newMatch = {
      date: match.date,
      competition: match.competition,
      matchday: match.matchday,
      opponent: match.opponent,
      home: match.home,
      score: match.score || ''
    };
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
