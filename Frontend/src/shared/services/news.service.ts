import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { environment } from '../../environments/environment.prod';

export interface News {
  _id?: string;
  title: string;
  content: string;
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private apiUrl = environment.apiUrl + '/news';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  getNewsById(id: string): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  createNews(news: FormData): Observable<News> {
    return this.http.post<News>(this.apiUrl, news, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  updateNews(id: string, news: FormData): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${id}`, news, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  deleteNews(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}
