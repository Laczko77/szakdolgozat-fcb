import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private apiUrl = 'http://localhost:3000/api/forum';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  createPost(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  updatePost(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}
