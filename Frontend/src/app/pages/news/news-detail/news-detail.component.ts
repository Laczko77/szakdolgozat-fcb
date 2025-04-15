import { Component, OnInit } from '@angular/core';
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
    const id = this.route.snapshot.paramMap.get('id');
    const isValidId = id && /^[a-f\d]{24}$/i.test(id); // csak valódi MongoDB ObjectId
  
    if (isValidId) {
      this.newsService.getNewsById(id!).subscribe((data) => {
        this.newsItem = data;
      });
    }
  }
  
}
