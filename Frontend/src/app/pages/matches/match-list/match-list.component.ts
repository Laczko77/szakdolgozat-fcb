// match-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatchService, Match } from '../../../../shared/services/match.service';
import { AnalyticsService } from '../../../../shared/services/analytics.service';



@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
  standalone: false
})
export class MatchListComponent implements OnInit {
  allMatches: Match[] = [];

  constructor(private matchService: MatchService,private analyticsService: AnalyticsService) {}

  onButtonClick() {
    this.analyticsService.sendButtonClick('Jegyvásárlás oldal');
  }

  ngOnInit(): void {
    this.matchService.getAll().subscribe(matches => {
      this.allMatches = matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }

  formatTeams(match: Match): string {
    if (match.home === 'home') {
      return `FC Barcelona ${match.score || 'vs'} ${match.opponent}`;
    } else if (match.home === 'away') {
      return `${match.opponent} ${match.score || 'vs'} FC Barcelona`;
    } else {
      return `FC Barcelona ${match.score || 'vs'} ${match.opponent}`;
    }
  }
}