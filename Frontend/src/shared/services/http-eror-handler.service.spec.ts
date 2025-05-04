import { TestBed } from '@angular/core/testing';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';

describe('HttpErrorHandlerService', () => {
  let service: HttpErrorHandlerService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        HttpErrorHandlerService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(HttpErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle status 0 error (no connection)', () => {
    const error = { status: 0 };
    service.handleError(error).subscribe({
      error: err => expect(err).toEqual(error)
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Nem sikerült csatlakozni a szerverhez.', 'Bezár', jasmine.any(Object)
    );
  });

  it('should handle 500+ error', () => {
    const error = { status: 500 };
    service.handleError(error).subscribe({
      error: err => expect(err).toEqual(error)
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Szerverhiba történt. Próbáld újra később.', 'Bezár', jasmine.any(Object)
    );
  });

  it('should handle 401 error', () => {
    const error = { status: 401 };
    service.handleError(error).subscribe({
      error: err => expect(err).toEqual(error)
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Bejelentkezés szükséges.', 'Bezár', jasmine.any(Object)
    );
  });

  it('should handle 403 error', () => {
    const error = { status: 403 };
    service.handleError(error).subscribe({
      error: err => expect(err).toEqual(error)
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Nincs jogosultságod a művelethez.', 'Bezár', jasmine.any(Object)
    );
  });

  it('should translate known string error messages', () => {
    const error = { status: 400, error: 'Invalid credentials' };
    service.handleError(error).subscribe({
      error: err => expect(err).toEqual(error)
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Hibás e-mail cím vagy jelszó.', 'Bezár', jasmine.any(Object)
    );
  });

  it('should translate message property in error object', () => {
    const error = { status: 400, error: { message: 'User already exists' } };
    service.handleError(error).subscribe({
      error: err => expect(err).toEqual(error)
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Ez az e-mail cím már regisztrálva van.', 'Bezár', jasmine.any(Object)
    );
  });

  it('should translate nested error property in error object', () => {
    const error = { status: 400, error: { error: 'Invalid credentials' } };
    service.handleError(error).subscribe({
      error: err => expect(err).toEqual(error)
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Hibás e-mail cím vagy jelszó.', 'Bezár', jasmine.any(Object)
    );
  });

  it('should fallback to unknown error message', () => {
    const error = { status: 400, error: { unexpected: true } };
    service.handleError(error).subscribe({
      error: err => expect(err).toEqual(error)
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Ismeretlen hiba történt.', 'Bezár', jasmine.any(Object)
    );
  });
});
