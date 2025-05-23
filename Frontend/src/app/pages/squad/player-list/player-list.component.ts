
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PlayerService, Player } from '../../../../shared/services/player.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
  standalone: false
})
export class PlayerListComponent implements OnInit , AfterViewInit{
  players: Player[] = [];
  groupedPlayers: { [key: string]: Player[] } = {};
  positionOrder = ["Kapus", "Védő", "Középpályás", "Támadó", "Edzők", "Legenda"];
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.getAll().subscribe(players => {
      this.players = players;
      this.groupByRole(); // új logika, pozíció + edző
    });
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
      threshold: 0.04
    });

    this.fadeElements.changes.subscribe((elements: QueryList<ElementRef>) => {
      elements.forEach((el) => observer.observe(el.nativeElement));
    });

    // Azonnal is lefuttatjuk, ha már van elem
    this.fadeElements.forEach((el) => observer.observe(el.nativeElement));
  }


  groupByRole(): void {
    this.groupedPlayers = {};
  
    this.players.forEach(player => {
      const key = player.isCoach ? 'Edzők' : player.position;
  
      if (!this.groupedPlayers[key]) {
        this.groupedPlayers[key] = [];
      }
  
      this.groupedPlayers[key].push(player); 
    });
  }

  comparePositions = (a: {key: string}, b: {key: string}) => {
  const order = this.positionOrder;
  return order.indexOf(a.key) - order.indexOf(b.key);
}

} 

