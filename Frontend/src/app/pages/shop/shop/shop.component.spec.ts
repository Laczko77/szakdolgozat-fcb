import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';
import { ProductService } from '../../../../shared/services/product.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef, QueryList } from '@angular/core';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProducts = [
    { _id: '1', name: 'Messi Mez', description: '', price: 100, imageUrl: '', category: 'Felnőtt' },
    { _id: '2', name: 'Gyerek Mez', description: '', price: 80, imageUrl: '', category: 'Gyerek' },
    { _id: '3', name: 'Kapus Mez', description: '', price: 90, imageUrl: '', category: 'Kapus' },
  ];

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    mockProductService.getProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      declarations: [ShopComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;

    // Globálisan mockoljuk a scrollIntoView függvényt
    component.productSection = {
      nativeElement: {
        scrollIntoView: jasmine.createSpy('scrollIntoView')
      }
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(component.products.length).toBe(3);
    expect(component.filteredProducts.length).toBe(3);
  });

  it('should handle error when loading products fails', () => {
    spyOn(console, 'error');
    mockProductService.getProducts.and.returnValue(throwError(() => new Error('Hiba')));
    component.loadProducts();
    expect(console.error).toHaveBeenCalledWith('Hiba a termékek betöltésekor:', jasmine.any(Error));
  });

  it('should filter products by search query and category', () => {
    component.searchQuery = 'mez';
    component.selectedCategory = 'Gyerek';
    component.onSearch();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toContain('Gyerek');
  });

  it('should paginate products correctly', () => {
    component.products = Array.from({ length: 20 }, (_, i) => ({
      _id: `${i}`,
      name: `Termék ${i}`,
      description: '',
      price: 50,
      imageUrl: '',
      category: 'Felnőtt'
    }));
    component.filteredProducts = component.products;
    component.productsPerPage = 8;
    expect(component.totalPages).toBe(3);

    component.changePage(2);
    expect(component.currentPage).toBe(2);
    expect(component.paginatedProducts.length).toBe(8);
  });

  it('should not change page if out of bounds', () => {
    component.filteredProducts = Array(16).fill({ name: '', description: '', price: 0, imageUrl: '', category: '' });
    component.currentPage = 1;
    component.changePage(0);
    expect(component.currentPage).toBe(1);
    component.changePage(3);
    expect(component.currentPage).toBe(1);
  });

  it('should scroll to top when changing page', () => {
    const scrollSpy = jasmine.createSpy('scrollIntoView');
  
    component.productSection = {
      nativeElement: {
        scrollIntoView: scrollSpy
      }
    } as any;
  
    component.filteredProducts = Array(10).fill({ name: 'a', description: '', price: 0, imageUrl: '', category: '' });
    component.productsPerPage = 5;
    component.changePage(2);
  
    expect(scrollSpy).toHaveBeenCalled();
  });
  

  it('should initialize fade animation observer on ngAfterViewInit', () => {
    const observeSpy = spyOn(IntersectionObserver.prototype, 'observe');
  
    const mockElement = document.createElement('div');
    component.fadeElements = new QueryList<ElementRef>();
    (component.fadeElements as any)._results = [new ElementRef(mockElement)];
  
    // ⚠️ changes helyett csak az observerre koncentrálunk
    component.ngAfterViewInit();
  
    expect(observeSpy).toHaveBeenCalledWith(mockElement);
  });
  
});
