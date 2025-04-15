import { Component, OnInit } from '@angular/core';
import { NewsService, News } from '../../../../shared/services/news.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  newsList: News[] = [];

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
    this.newsService.getNews().subscribe((data) => {
      this.newsList = data;
    });
  }

  goToDetail(id: string | undefined) {
    if (id) {
      this.router.navigate(['/news', id]);
    }
  }
}
