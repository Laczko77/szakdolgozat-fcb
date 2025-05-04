import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { AuthService } from './auth.service';
import { Product } from '../../app/pages/shop/product-admin/product-admin.component';
import { Player } from './player.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(
    private http: HttpClient,
    private errorHandler: HttpErrorHandlerService,
    private authService: AuthService 
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  createProduct(formData: FormData) {
    return this.http.post(this.apiUrl, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  updateProduct(id: string, formData: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}
