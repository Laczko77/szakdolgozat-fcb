import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';

export interface Match {
  _id?: string;
  date: string; 
  competition: string;
  matchday: string;
  opponent: string;
  home: 'home' | 'away' | 'neutral';
  score?: string;
}

@Injectable({ providedIn: 'root' })
export class MatchService {
  private apiUrl = 'http://localhost:3000/api/matches';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  getAll(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  create(match: Match): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  update(id: string, match: Match): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${id}`, match, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}
