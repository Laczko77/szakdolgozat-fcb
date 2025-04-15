import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface News {
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://localhost:3000/api/news';

  constructor(private http: HttpClient) {}

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl);
  }

  
  getNewsById(id: string): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`);
  }

  createNews(news: News): Observable<News> {
    return this.http.post<News>(this.apiUrl, news);
  }

  updateNews(id: string, news: News): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${id}`, news);
  }
  
  deleteNews(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
