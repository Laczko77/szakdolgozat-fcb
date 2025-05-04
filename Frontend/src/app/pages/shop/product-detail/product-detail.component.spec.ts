import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductService } from '../../../../shared/services/product.service';
import { Cart, CartService } from '../../../../shared/services/cart.service';
import { PlayerService } from '../../../../shared/services/player.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../../../shared/services/analytics.service';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockPlayerService: jasmine.SpyObj<PlayerService>;
  let mockAnalyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProductById']);
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);
    mockCartService.addToCart.and.returnValue(of({ items: [] } as Cart));
    mockPlayerService = jasmine.createSpyObj('PlayerService', ['getAll']);
    mockPlayerService.getAll.and.returnValue(of([]));
    mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', ['sendViewItem', 'sendButtonClick']);

    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
        { provide: PlayerService, useValue: mockPlayerService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    mockProductService.getProductById.and.returnValue(of({
      _id: '123',
      name: 'Test Shirt',
      price: 100,
      imageUrl: 'image.jpg',
      category: 'Mez',
      description: 'desc'
    }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product data on init', () => {
    expect(component.product?._id).toBe('123');
    expect(component.product?.name).toBe('Test Shirt');
  });

  it('should call addToCart with correct parameters', () => {
    component.selectedSize = 'M';
    component.selectedPlayer = 'Messi';
    component.addToCart();
    expect(mockCartService.addToCart).toHaveBeenCalledWith('123', 1, 'M', 'Messi');
  });

  it('should not call addToCart if product is null', () => {
    component.product = null as any;
    component.addToCart();
    expect(mockCartService.addToCart).not.toHaveBeenCalled();
  });

  it('should call analyticsService.sendViewItem when product is loaded', () => {
    expect(mockAnalyticsService.sendViewItem).toHaveBeenCalledWith('123', 'Test Shirt');
  });

  it('should call loadPlayers if category is Mez', () => {
    const spy = spyOn(component, 'loadPlayers');
    mockProductService.getProductById.and.returnValue(of({
      _id: '123',
      name: 'Test Shirt',
      price: 100,
      imageUrl: 'image.jpg',
      category: 'Mez',
      description: 'desc'
    }));
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call analyticsService.sendButtonClick on button click', () => {
    component.onButtonClick();
    expect(mockAnalyticsService.sendButtonClick).toHaveBeenCalledWith('Termék kosárba rakása');
  });

  it('should load players and filter them with position', () => {
    const mockPlayers = [
      { name: 'Player1', position: 'FW' },
      { name: 'Player2', position: null }
    ];
    mockPlayerService.getAll.and.returnValue(of(mockPlayers as any));
    component.loadPlayers();
    expect(component.players.length).toBe(1);
    expect(component.players[0].name).toBe('Player1');
  });
});
