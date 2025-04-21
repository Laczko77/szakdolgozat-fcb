import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: {
    productId: {
      _id: string;
      name: string;
      price: number;
      imageUrl: string;
      category: string;
    };
    quantity: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, { productId, quantity }, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  removeFromCart(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${productId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  decreaseQuantity(productId: string): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/decrease`, { productId }, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}
