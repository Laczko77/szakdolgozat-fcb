// match-list.component.ts
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatchService, Match } from '../../../../shared/services/match.service';
import { AnalyticsService } from '../../../../shared/services/analytics.service';



@Component({

  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
  standalone: false
})
export class MatchListComponent implements OnInit, AfterViewInit {

  allMatches: Match[] = [];
  groupedMatches: { [month: string]: Match[] } = {};
  monthOrder: string[] = [];
  selectedMatch: Match | null = null;
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  constructor(private matchService: MatchService,private analyticsService: AnalyticsService) {}

  onButtonClick() {
    this.analyticsService.sendButtonClick('Jegyvásárlás oldal');
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

  ngOnInit(): void {
    this.loadMatches();
  }


  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
        
      });
    }, {
      threshold: 0.03
    });

    this.fadeElements.changes.subscribe((elements: QueryList<ElementRef>) => {
      elements.forEach((el) => observer.observe(el.nativeElement));
    });

    // Azonnal is lefuttatjuk, ha már van elem
    this.fadeElements.forEach((el) => observer.observe(el.nativeElement));
  }


  selectMatch(match: Match): void {
    this.selectedMatch = match;
  }
  
  closeOverlay(): void {
    this.selectedMatch = null;
  }

  loadMatches(): void {
    this.matchService.getAll().subscribe({
      next: (data) => {
        if (!data || !Array.isArray(data)) {
          console.error('Nem megfelelő meccs-adatok:', data);
          return;
        }

        this.allMatches = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        this.groupMatchesByMonth();
      },
      error: (err) => {
        console.error('Hiba a meccsek betöltésekor:', err);
      }
    });
  }

  groupMatchesByMonth(): void {
    this.groupedMatches = {};
    this.monthOrder = [];
  
    this.allMatches.forEach(match => {
      const date = new Date(match.date);
      const month = date.toLocaleString('hu-HU', { month: 'long', year: 'numeric' }).toUpperCase();
  
      if (!this.groupedMatches[month]) {
        this.groupedMatches[month] = [];
        this.monthOrder.push(month); 
      }
  
      this.groupedMatches[month].push(match);
    });
  }
  

  formatMatchday(matchday: string): string {
    return /\d/.test(matchday) ? `${matchday} forduló` : matchday;
  }
}