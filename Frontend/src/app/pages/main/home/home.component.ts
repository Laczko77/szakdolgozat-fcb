import { Component, OnInit } from '@angular/core';
import { NewsService, News } from '../../../../shared/services/news.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newsList: News[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getNews().subscribe((data) => {
      this.newsList = data;
    });
  }
}
