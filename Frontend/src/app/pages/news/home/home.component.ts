import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NewsService, News } from '../../../../shared/services/news.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ // belépés animáció
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [ // kilépés animáció
        animate('400ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
  
})
export class HomeComponent implements OnInit, AfterViewInit{


  newsList: News[] = [];
  visibleNews: any[] = [];
  itemsPerPage = 3;
  currentIndex = 0;

  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000
  };

  constructor(private newsService: NewsService, private router: Router) {}

  ngOnInit(): void {
  this.newsService.getNews().subscribe(data => {
    this.newsList = data;
    this.loadMoreNews();
  });
}

loadMoreNews(): void {
  const nextChunk = this.newsList.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
  this.visibleNews = [...this.visibleNews, ...nextChunk];
  this.currentIndex += this.itemsPerPage;
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
      threshold: 0.08
    });

    this.fadeElements.changes.subscribe((elements: QueryList<ElementRef>) => {
      elements.forEach((el) => observer.observe(el.nativeElement));
    });

    // Azonnal is lefuttatjuk, ha már van elem
    this.fadeElements.forEach((el) => observer.observe(el.nativeElement));
  }
  
  get hasMoreNews(): boolean {
    return this.currentIndex < this.newsList.length;
  }
  
  get canCollapse(): boolean {
    return this.visibleNews.length > this.itemsPerPage;
  }


  resetNews(): void {
    this.visibleNews = this.newsList.slice(0, this.itemsPerPage);
    this.currentIndex = this.itemsPerPage;
  }

  goToDetail(id: string | undefined) {
    if (id) {
      this.router.navigate(['/home/news', id]);
    }
  }
}
