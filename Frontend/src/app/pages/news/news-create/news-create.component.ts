import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewsService, News } from '../../../../shared/services/news.service';

@Component({
  selector: 'app-news-create',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.scss'],
  standalone: false
})
export class NewsCreateComponent {
  newsList: News[] = [];
  selectedNews: News | null = null;
  newsForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private newsService: NewsService,
    private fb: FormBuilder
  ) {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getNews().subscribe({
      next: (data) => (this.newsList = data),
      error: (err) => console.error('Hírek betöltési hiba:', err),
    });
  }

  selectForEdit(news: News) {
    this.selectedNews = news;
    this.newsForm.patchValue(news);
  }

  clearForm() {
    this.selectedNews = null;
    this.newsForm.reset();
  }

  deleteNews(id: string) {
    if (confirm('Biztosan törölni szeretnéd a hírt?')) {
      this.newsService.deleteNews(id).subscribe({
        next: () => this.loadNews(),
        error: (err) => console.error('Törlési hiba:', err),
      });
    }
  }

  submit() {
    console.log('Küldött ID:', this.selectedNews?._id);
    if (this.newsForm.invalid) {
      this.newsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    if (this.selectedNews) {
      // Szerkesztés
      this.newsService.updateNews(this.selectedNews._id!, this.newsForm.value).subscribe({
        next: () => {
          this.loadNews();
          this.clearForm();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Szerkesztési hiba:', err);
          this.isSubmitting = false;
        },
      });
    } else {
      // Új hír létrehozása
      this.newsService.createNews(this.newsForm.value).subscribe({
        next: () => {
          this.loadNews();
          this.newsForm.reset();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Létrehozási hiba:', err);
          this.isSubmitting = false;
        },
      });
    }
  }
}