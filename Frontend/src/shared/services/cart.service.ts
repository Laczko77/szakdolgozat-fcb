import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Cart>(this.apiUrl, { headers });
  }

  addToCart(productId: string, quantity: number = 1): Observable<Cart> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Cart>(this.apiUrl, { productId, quantity }, { headers });
  }

  removeFromCart(productId: string): Observable<Cart> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<Cart>(`${this.apiUrl}/${productId}`, { headers });
  }

  clearCart(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}`, { headers });
  }
  decreaseQuantity(productId: string): Observable<Cart> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Cart>(`${this.apiUrl}/decrease`, { productId }, { headers });
  }
}
