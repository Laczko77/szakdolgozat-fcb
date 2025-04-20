import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getUpcomingMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/matches`);
  }

  getAllPolls(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/poll`, this.getAuthHeaders());
  }

  createPoll(pollData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/poll`, pollData, this.getAuthHeaders());
  }

  closePoll(pollId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/poll/${pollId}/close`, {}, this.getAuthHeaders());
  }

  deletePoll(pollId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/poll/${pollId}`, this.getAuthHeaders());
  }

  evaluatePoll(pollId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/poll/${pollId}/evaluate`, data, this.getAuthHeaders());
  }

  votePoll(pollId: string, vote: { questionIndex: number, selectedOption: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/poll/${pollId}/vote`, vote, this.getAuthHeaders());
  }
}
