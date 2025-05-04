import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { HttpErrorHandlerService } from './http-error-handler.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let errorHandlerSpy: jasmine.SpyObj<HttpErrorHandlerService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    errorHandlerSpy = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);
  
    // 🔒 Blokkoljuk a localStorage manipulációkat
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'removeItem').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue(null);
  
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: HttpErrorHandlerService, useValue: errorHandlerSpy }
      ]
    });
  
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call /api/users/register on register()', () => {
    service.register('TestUser', 'test@example.com', '1234').subscribe();
    const req = httpMock.expectOne('http://localhost:3000/api/users/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'TestUser',
      email: 'test@example.com',
      password: '1234'
    });
    req.flush({ success: true });
  });

  it('should call /api/users/login on login()', () => {
    const mockToken = 'mocktoken123';
    service.login('admin@example.com', 'password123').subscribe(response => {
      expect(response.token).toBe(mockToken);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/users/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: mockToken });
  });

  it('should remove token and navigate to login on logout()', () => {
    localStorage.setItem('token', 'fakeToken');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
