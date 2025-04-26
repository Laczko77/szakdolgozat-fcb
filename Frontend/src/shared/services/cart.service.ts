import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { Player } from './player.service';
import { Product } from '../../app/pages/shop/product-admin/product-admin.component';

export interface CartItem {
[x: string]: any;
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  quantity: number;
  size?: string; // választható méret (pl. 'M', 'L', stb.)
  player?: { _id: string; name: string } | Player; // választható játékos (csak ha 'Mez' kategória)
}

export interface Cart {
  items: CartItem[];
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

  addToCart(productId: string, quantity: number, size?: string, playerId?: string) {
    const payload: any = { productId, quantity };
    if (size) payload.size = size;
    if (playerId) payload.playerId = playerId;
  
    return this.http.post(`${this.apiUrl}`, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
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

  decreaseQuantity(productId: string, size?: string, playerId?: string) {
    return this.http.post<Cart>(`${this.apiUrl}/decrease`, { productId, size, playerId }, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => this.errorHandler.handleError(err)));
  }
  
}
