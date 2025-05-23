import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { environment } from '../../environments/environment.prod';

export interface Player {
  _id?: string;
  name: string;
  number: number;
  position: string;
  nationality: string;
  birthDate: string;
  imageUrl: string;
  appearances: number;
  goals: number;
  assists: number;
  isCoach: boolean;
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private apiUrl = environment.apiUrl + '/players';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  getAll(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  create(player: FormData): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  update(id: string, player: FormData): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${id}`, player, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  getPlayerById(playerId: string): Observable<Player> {
    return this.http.get<Player>(`http://localhost:3000/api/players/${playerId}`);
  }
  
}
