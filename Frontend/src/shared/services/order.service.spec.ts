import { TestBed } from '@angular/core/testing';
import { OrderService, Order } from './order.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let errorHandlerMock: jasmine.SpyObj<HttpErrorHandlerService>;

  const dummyOrders: Order[] = [
    {
      _id: 'o1',
      items: [
        {
          productId: { _id: 'p1', name: 'Termék 1', price: 100 },
          quantity: 2,
          size: 'M'
        }
      ],
      status: 'Feldolgozás alatt',
      createdAt: '2025-05-03'
    }
  ];

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['post', 'get', 'patch', 'delete', 'put']);
    errorHandlerMock = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: HttpClient, useValue: httpMock },
        { provide: HttpErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(OrderService);
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should place an order', () => {
    httpMock.post.and.returnValue(of({ success: true }));
    service.placeOrder().subscribe(res => {
      expect(res).toEqual({ success: true });
    });
    expect(httpMock.post).toHaveBeenCalled();
  });

  it('should get my orders', () => {
    httpMock.get.and.returnValue(of(dummyOrders));
    service.getMyOrders().subscribe(orders => {
      expect(orders).toEqual(dummyOrders);
    });
    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/orders', jasmine.any(Object));
  });

  it('should get all orders', () => {
    httpMock.get.and.returnValue(of(dummyOrders));
    service.getAllOrders().subscribe(orders => {
      expect(orders).toEqual(dummyOrders);
    });
    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/orders/all', jasmine.any(Object));
  });

  it('should update order status', () => {
    httpMock.patch.and.returnValue(of({ updated: true }));
    service.updateOrderStatus('o1', 'Kézbesítve').subscribe(res => {
      expect(res).toEqual({ updated: true });
    });
    expect(httpMock.patch).toHaveBeenCalledWith('http://localhost:3000/api/orders/o1/status', { status: 'Kézbesítve' }, jasmine.any(Object));
  });

  it('should delete order', () => {
    httpMock.delete.and.returnValue(of({ deleted: true }));
    service.deleteOrder('o1').subscribe(res => {
      expect(res).toEqual({ deleted: true });
    });
    expect(httpMock.delete).toHaveBeenCalledWith('http://localhost:3000/api/orders/o1', jasmine.any(Object));
  });

  it('should mark order as completed', () => {
    httpMock.put.and.returnValue(of({ completed: true }));
    service.markAsCompleted('o1').subscribe(res => {
      expect(res).toEqual({ completed: true });
    });
    expect(httpMock.put).toHaveBeenCalledWith('http://localhost:3000/api/orders/o1/complete', {}, jasmine.any(Object));
  });

  it('should handle error on getMyOrders', () => {
    const error = new Error('hiba');
    httpMock.get.and.returnValue(throwError(() => error));
    errorHandlerMock.handleError.and.returnValue(throwError(() => error));

    service.getMyOrders().subscribe({ error: err => expect(err).toBe(error) });
    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(error);
  });
});
