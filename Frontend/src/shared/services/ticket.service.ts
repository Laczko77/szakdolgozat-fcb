import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';

export interface TicketRequest {
  matchId: string;
  tickets: { category: string; quantity: number }[];
}

export interface TicketResponse {
  _id: string;
  matchId: any;
  tickets: { category: string; quantity: number }[];
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private apiUrl = 'http://localhost:3000/api/tickets';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  createTicketOrder(request: TicketRequest): Observable<any> {
    return this.http.post(this.apiUrl, request, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  getMyTickets(): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(`${this.apiUrl}/my`, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}
