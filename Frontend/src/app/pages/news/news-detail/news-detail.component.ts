import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService, News } from '../../../../shared/services/news.service';



@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  standalone: false
})
export class NewsDetailComponent implements OnInit {

  
  newsItem?: News;


  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}


  ngOnInit(): void {
    const newsId = this.route.snapshot.paramMap.get('id');
    if (newsId) {
      this.newsService.getNewsById(newsId).subscribe(news => {
        this.newsItem = news;
      });
    }
  }
  


}
