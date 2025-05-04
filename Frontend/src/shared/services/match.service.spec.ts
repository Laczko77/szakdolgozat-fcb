import { TestBed } from '@angular/core/testing';
import { MatchService, Match } from './match.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';

describe('MatchService', () => {
  let service: MatchService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let errorHandlerSpy: jasmine.SpyObj<HttpErrorHandlerService>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    errorHandlerSpy = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        MatchService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: HttpErrorHandlerService, useValue: errorHandlerSpy }
      ]
    });

    service = TestBed.inject(MatchService);
  });

  const mockMatch: Match = {
    _id: '1',
    date: '2025-06-01',
    competition: 'La Liga',
    matchday: '37',
    opponent: 'Valencia',
    home: 'home',
    score: '2-0'
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all matches', () => {
    httpSpy.get.and.returnValue(of([mockMatch]));

    service.getAll().subscribe(matches => {
      expect(matches).toEqual([mockMatch]);
    });

    expect(httpSpy.get).toHaveBeenCalledWith('http://localhost:3000/api/matches');
  });

  it('should create a match', () => {
    httpSpy.post.and.returnValue(of(mockMatch));

    service.create(mockMatch).subscribe(res => {
      expect(res).toEqual(mockMatch);
    });

    expect(httpSpy.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/matches',
      mockMatch,
      jasmine.any(Object)
    );
  });

  it('should update a match', () => {
    httpSpy.put.and.returnValue(of(mockMatch));

    service.update('1', mockMatch).subscribe(res => {
      expect(res).toEqual(mockMatch);
    });

    expect(httpSpy.put).toHaveBeenCalledWith(
      'http://localhost:3000/api/matches/1',
      mockMatch,
      jasmine.any(Object)
    );
  });

  it('should delete a match', () => {
    httpSpy.delete.and.returnValue(of({ success: true }));

    service.delete('1').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpSpy.delete).toHaveBeenCalledWith(
      'http://localhost:3000/api/matches/1',
      jasmine.any(Object)
    );
  });

  it('should handle error on getAll', () => {
    const error = new Error('Hiba');
    httpSpy.get.and.returnValue(throwError(() => error));
    errorHandlerSpy.handleError.and.returnValue(throwError(() => error));

    service.getAll().subscribe({ error: err => expect(err).toBe(error) });

    expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(error);
  });
});
