import { TestBed } from '@angular/core/testing';
import { CartService, Cart } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';

describe('CartService', () => {
  let service: CartService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let errorHandlerMock: jasmine.SpyObj<HttpErrorHandlerService>;

  const dummyCart: Cart = {
    items: [
      {
        productId: {
          _id: 'p1',
          name: 'Termék 1',
          price: 100,
          imageUrl: 'url',
          category: 'Mez'
        },
        quantity: 2,
        size: 'M',
        player: { _id: 'pl1', name: 'Lewandowski' }
      }
    ]
  };

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
    errorHandlerMock = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: HttpClient, useValue: httpMock },
        { provide: HttpErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(CartService);
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get cart', () => {
    httpMock.get.and.returnValue(of(dummyCart));
    service.getCart().subscribe(cart => {
      expect(cart).toEqual(dummyCart);
    });
    expect(httpMock.get).toHaveBeenCalled();
  });

  it('should handle error on getCart', () => {
    const error = new Error('hiba');
    httpMock.get.and.returnValue(throwError(() => error));
    errorHandlerMock.handleError.and.returnValue(throwError(() => error));

    service.getCart().subscribe({
      error: err => expect(err).toBe(error)
    });

    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(error);
  });

  it('should add to cart and update subject', () => {
    httpMock.post.and.returnValue(of(dummyCart));
    const spy = jasmine.createSpy();
    service.cart$.subscribe(spy);

    service.addToCart('p1', 1, 'M', 'pl1').subscribe(cart => {
      expect(cart).toEqual(dummyCart);
      expect(spy).toHaveBeenCalledWith(dummyCart);
    });

    expect(httpMock.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/cart',
      { productId: 'p1', quantity: 1, size: 'M', playerId: 'pl1' },
      jasmine.any(Object)
    );
  });

  it('should remove from cart', () => {
    httpMock.post.and.returnValue(of(dummyCart));

    service.removeFromCart('p1', 'M', 'pl1').subscribe(cart => {
      expect(cart).toEqual(dummyCart);
    });

    expect(httpMock.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/cart/remove',
      { productId: 'p1', size: 'M', playerId: 'pl1' },
      jasmine.any(Object)
    );
  });

  it('should clear cart', () => {
    httpMock.delete.and.returnValue(of({}));

    service.clearCart().subscribe(res => {
      expect(res).toEqual({});
    });

    expect(httpMock.delete).toHaveBeenCalled();
  });

  it('should decrease quantity', () => {
    httpMock.post.and.returnValue(of(dummyCart));

    service.decreaseQuantity('p1', 'M', 'pl1').subscribe(cart => {
      expect(cart).toEqual(dummyCart);
    });

    expect(httpMock.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/cart/decrease',
      { productId: 'p1', size: 'M', playerId: 'pl1' },
      jasmine.any(Object)
    );
  });
});
