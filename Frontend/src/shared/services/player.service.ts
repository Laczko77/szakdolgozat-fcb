import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  getAll(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  create(player: Player): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player, this.getHeaders());
  }
  
  update(id: string, player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${id}`, player, this.getHeaders());
  }
  

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
