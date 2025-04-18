import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private apiUrl = environment.apiUrl + '/forum';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createPost(formData: FormData) {
    return this.http.post(this.apiUrl, formData, {
      headers: this.getAuthHeaders()
    });
  }

  getPosts() {
    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  deletePost(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
