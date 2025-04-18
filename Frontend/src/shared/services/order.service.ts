import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  _id: string;
  products: {
    productId: any;
    quantity: number;
  }[];
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  placeOrder(): Observable<any> {
    return this.http.post(this.apiUrl, {}, this.getHeaders());
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, this.getHeaders()); // <- helyes útvonal: /api/orders
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, this.getHeaders());
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status }, this.getHeaders());
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  markAsCompleted(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/complete`, {}, this.getHeaders());
  }
}
