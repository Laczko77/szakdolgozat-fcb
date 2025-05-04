import { TestBed } from '@angular/core/testing';
import { TicketService, TicketRequest, TicketResponse } from './ticket.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let errorHandlerMock: jasmine.SpyObj<HttpErrorHandlerService>;

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    errorHandlerMock = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        TicketService,
        { provide: HttpClient, useValue: httpMock },
        { provide: HttpErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(TicketService);
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create ticket order', () => {
    const request: TicketRequest = {
      matchId: 'match123',
      tickets: [{ category: 'A', quantity: 2 }]
    };
    const response = { success: true };

    httpMock.post.and.returnValue(of(response));

    service.createTicketOrder(request).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(httpMock.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/tickets',
      request,
      jasmine.any(Object)
    );
  });

  it('should handle error when creating ticket order', () => {
    const error = new Error('Hiba');
    httpMock.post.and.returnValue(throwError(() => error));
    errorHandlerMock.handleError.and.returnValue(throwError(() => error));

    service.createTicketOrder({ matchId: '', tickets: [] }).subscribe({
      error: err => expect(err).toBe(error)
    });

    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(error);
  });

  it('should get my tickets', () => {
    const tickets: TicketResponse[] = [
      {
        _id: 't1',
        matchId: { _id: 'm1', opponent: 'Valencia' },
        tickets: [{ category: 'B', quantity: 1 }],
        createdAt: '2025-05-01T10:00:00Z'
      }
    ];
    httpMock.get.and.returnValue(of(tickets));

    service.getMyTickets().subscribe(res => {
      expect(res).toEqual(tickets);
    });

    expect(httpMock.get).toHaveBeenCalledWith(
      'http://localhost:3000/api/tickets/my',
      jasmine.any(Object)
    );
  });

  it('should handle error when getting my tickets', () => {
    const error = new Error('Hiba');
    httpMock.get.and.returnValue(throwError(() => error));
    errorHandlerMock.handleError.and.returnValue(throwError(() => error));

    service.getMyTickets().subscribe({
      error: err => expect(err).toBe(error)
    });

    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(error);
  });
});
