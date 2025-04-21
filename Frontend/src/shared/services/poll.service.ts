import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({ providedIn: 'root' })
export class PollService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getUpcomingMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/matches`).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  getAllPolls(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/poll`, this.getAuthHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  createPoll(pollData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/poll`, pollData, this.getAuthHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  closePoll(pollId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/poll/${pollId}/close`, {}, this.getAuthHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  deletePoll(pollId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/poll/${pollId}`, this.getAuthHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  evaluatePoll(pollId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/poll/${pollId}/evaluate`, data, this.getAuthHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  votePoll(pollId: string, vote: { questionIndex: number, selectedOption: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/poll/${pollId}/vote`, vote, this.getAuthHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}
