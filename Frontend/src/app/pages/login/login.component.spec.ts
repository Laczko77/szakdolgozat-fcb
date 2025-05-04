import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../../shared/services/auth.service';
import { AnalyticsService } from '../../../shared/services/analytics.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


declare global {
  interface Window {
    google: any;
  }
}

// Mock Google API
window.google = {
  accounts: {
    id: {
      initialize: () => {},
      renderButton: () => {}
    }
  }
};


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule, HttpClientTestingModule , FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: AnalyticsService, useValue: jasmine.createSpyObj('AnalyticsService', ['sendButtonClick']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate on success', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'fake-token' }));
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');
  
    component.email = 'test@example.com';
    component.password = 'password';
    component.onLogin();
  
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(navigateSpy).toHaveBeenCalledWith('/profile'); // vagy amit a returnUrl tartalmaz
  });
  

  it('should show error message on failed login', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));
    component.email = 'bad@example.com';
    component.password = 'wrong';
    component.onLogin();
    expect(component.errorMessage).toBe('Hibás email vagy jelszó!');
  });
});
