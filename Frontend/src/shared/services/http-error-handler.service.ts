import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any) {
    console.error('HTTP Error:', error);

    const message = this.getFriendlyMessage(error);
    this.snackBar.open(message, 'Bezár', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });

    return throwError(() => error);
  }

  private translateError(message: string): string {
    switch (message) {
      case 'User already exists': return 'Ez az e-mail cím már regisztrálva van.';
      case 'Invalid credentials': return 'Hibás e-mail cím vagy jelszó.';
      default: return message;
    }
  }
  

  private getFriendlyMessage(error: any): string {
    const raw = error.error;
  
    if (error.status === 0) {
      return 'Nem sikerült csatlakozni a szerverhez.';
    } else if (error.status >= 500) {
      return 'Szerverhiba történt. Próbáld újra később.';
    } else if (error.status === 401) {
      return 'Bejelentkezés szükséges.';
    } else if (error.status === 403) {
      return 'Nincs jogosultságod a művelethez.';
    } else if (typeof raw === 'string') {
      return this.translateError(raw);
    } else if (raw?.message) {
      return this.translateError(raw.message);
    } else if (raw?.error) {
      return this.translateError(raw.error);
    } else {
      return 'Ismeretlen hiba történt.';
    }
  }
  
  
  
}
