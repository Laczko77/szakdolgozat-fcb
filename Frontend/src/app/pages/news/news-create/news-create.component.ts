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
  searchTerm: string = '';
  selectedFile: File | null = null;

  constructor(
    private newsService: NewsService,
    private fb: FormBuilder
  ) {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadNews();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
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
    if (this.newsForm.invalid) return;
  
    const formData = new FormData();
    formData.append('title', this.newsForm.value.title);
    formData.append('content', this.newsForm.value.content);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    this.isSubmitting = true;
  
    if (this.selectedNews) {
      // FRISSÍTÉS (szerkesztés)
      this.newsService.updateNews(this.selectedNews._id!, formData).subscribe({
        next: () => {
          this.clearForm();
          this.loadNews();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Hiba a hír frissítésekor:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      // LÉTREHOZÁS
      this.newsService.createNews(formData).subscribe({
        next: () => {
          this.clearForm();
          this.loadNews();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Hiba a hír létrehozásakor:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
  

  filteredNews(): News[] {
    return this.newsList.filter(news =>
      news.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  edit(news: News) {
    this.selectedNews = news;
    this.selectedFile = null;
    this.newsForm.setValue({
      title: news.title,
      content: news.content
    });

    setTimeout(() => {
      document.getElementById('newsForm')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}