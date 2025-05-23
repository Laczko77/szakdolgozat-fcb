import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { environment } from '../../environments/environment.prod';

export interface Order {
  _id: string;
  items: ProductOrderItem[];
  status: string;
  createdAt: string;
}

export interface ProductOrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    category?: string;
  };
  quantity: number;
  size?: string;
  player?: {
    _id: string;
    name: string;
  };
}


@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = environment.apiUrl + '/orders';

  constructor(private http: HttpClient, private errorHandler: HttpErrorHandlerService) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  placeOrder(): Observable<any> {
    return this.http.post(this.apiUrl, {}, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status }, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  markAsCompleted(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/complete`, {}, this.getHeaders()).pipe(
      catchError(err => this.errorHandler.handleError(err))
    );
  }
}
