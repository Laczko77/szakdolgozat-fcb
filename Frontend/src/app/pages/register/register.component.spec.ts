import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { AnalyticsService } from '../../../shared/services/analytics.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let analyticsServiceSpy: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    analyticsServiceSpy = jasmine.createSpyObj('AnalyticsService', ['sendButtonClick']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AnalyticsService, useValue: analyticsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.register and navigate to /login on successful registration', () => {
    const mockForm = {
      valid: true,
      value: { username: 'testuser', email: 'test@example.com', password: 'pass' }
    } as any;

    authServiceSpy.register.and.returnValue(of({}));

    component.onSubmit(mockForm);
    expect(authServiceSpy.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'pass');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should NOT call AuthService.register if form is invalid', () => {
    const invalidForm = { valid: false, value: {} } as any;
    component.onSubmit(invalidForm);
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should not throw on registration error (error handled by service)', () => {
    const mockForm = {
      valid: true,
      value: { username: 'testuser', email: 'test@example.com', password: 'pass' }
    } as any;

    authServiceSpy.register.and.returnValue(throwError(() => new Error('Registration failed')));

    expect(() => component.onSubmit(mockForm)).not.toThrow();
  });

  it('should track analytics on button click', () => {
    component.onButtonClick();
    expect(analyticsServiceSpy.sendButtonClick).toHaveBeenCalledWith('Regisztráció');
  });
});
