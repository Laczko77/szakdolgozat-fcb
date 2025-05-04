import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:3000/api/forum';

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private authService: AuthService
  ) {}

  private getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.authService.getToken()}`
    };
  }

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  createPost(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  updatePost(postId: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postId}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  likePost(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/like`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  addComment(postId: string, text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/comment`, { text }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/${postId}/comment`, {
      headers: this.getAuthHeaders(),
      body: { commentId }
    }).pipe(catchError(err => this.errorHandler.handleError(err)));
  }

  updateComment(postId: string, commentId: string, text: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postId}/comment`, { commentId, text }, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  
}
