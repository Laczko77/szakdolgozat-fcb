import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { Product } from '../../app/pages/shop/product-admin/product-admin.component';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let errorHandlerMock: jasmine.SpyObj<HttpErrorHandlerService>;

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    errorHandlerMock = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: HttpClient, useValue: httpMock },
        { provide: HttpErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockProducts: Product[] = [{
      _id: '1',
      name: 'Mez',
      description: 'Hivatalos mez',
      price: 10000,
      imageUrl: 'img.jpg',
      category: 'Mez'
    }];
    httpMock.get.and.returnValue(of(mockProducts));

    service.getProducts().subscribe(res => {
      expect(res).toEqual(mockProducts);
    });

    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/products');
  });

  it('should handle error when getting products fails', () => {
    const error = new Error('Hiba');
    httpMock.get.and.returnValue(throwError(() => error));
    errorHandlerMock.handleError.and.returnValue(throwError(() => error));

    service.getProducts().subscribe({
      error: err => expect(err).toBe(error)
    });

    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(error);
  });

  it('should get product by ID', () => {
    const mockProduct: Product = {
      _id: '1',
      name: 'Mez',
      description: 'Hivatalos mez',
      price: 10000,
      imageUrl: 'img.jpg',
      category: 'Mez'
    };
    httpMock.get.and.returnValue(of(mockProduct));

    service.getProductById('1').subscribe(res => {
      expect(res).toEqual(mockProduct);
    });

    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/products/1');
  });

  it('should create a product', () => {
    const formData = new FormData();
    const response = { success: true };
    httpMock.post.and.returnValue(of(response));

    service.createProduct(formData).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(httpMock.post).toHaveBeenCalledWith('http://localhost:3000/api/products', formData);
  });

  it('should update a product', () => {
    const formData = new FormData();
    const response = { success: true };
    httpMock.put.and.returnValue(of(response));

    service.updateProduct('123', formData).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(httpMock.put).toHaveBeenCalledWith('http://localhost:3000/api/products/123', formData);
  });

  it('should delete a product', () => {
    const response = { success: true };
    httpMock.delete.and.returnValue(of(response));

    service.deleteProduct('123').subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(httpMock.delete).toHaveBeenCalledWith('http://localhost:3000/api/products/123');
  });

  it('should handle error when deleting product fails', () => {
    const error = new Error('Törlés hiba');
    httpMock.delete.and.returnValue(throwError(() => error));
    errorHandlerMock.handleError.and.returnValue(throwError(() => error));

    service.deleteProduct('123').subscribe({
      error: err => expect(err).toBe(error)
    });

    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(error);
  });
});
