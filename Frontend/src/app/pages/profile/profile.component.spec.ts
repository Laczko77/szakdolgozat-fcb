import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AnalyticsService } from '../../../shared/services/analytics.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAnalyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getUserData', 'logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', ['sendButtonClick']);

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    localStorage.setItem('token', 'fake-token'); // token beállítása
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data if authenticated and token exists', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getUserData.and.returnValue(of({ username: 'Teszt', email: 'teszt@example.com', score: 42 }));

    component.ngOnInit();

    expect(component.username).toBe('Teszt');
    expect(component.email).toBe('teszt@example.com');
    expect(component.points).toBe(42);
  });

  it('should set error message if token is missing', () => {
    localStorage.removeItem('token');
    mockAuthService.isAuthenticated.and.returnValue(true);

    component.ngOnInit();

    expect(component.errorMessage).toBe('Nincs érvényes token!');
  });

  it('should navigate to login if not authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error when user data load fails', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getUserData.and.returnValue(throwError(() => new Error('Backend error')));

    component.ngOnInit();

    expect(component.errorMessage).toBe('Nem sikerült betölteni a felhasználói adatokat!');
  });

  it('should logout and navigate to login', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should track logout button click', () => {
    component.onButtonClick();

    expect(mockAnalyticsService.sendButtonClick).toHaveBeenCalledWith('Kijelentkezés');
  });
});
