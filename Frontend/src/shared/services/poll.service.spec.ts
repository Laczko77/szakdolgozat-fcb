import { TestBed } from '@angular/core/testing';
import { PollService } from './poll.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';

describe('PollService', () => {
  let service: PollService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let errorHandlerMock: jasmine.SpyObj<HttpErrorHandlerService>;

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
    errorHandlerMock = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        PollService,
        { provide: HttpClient, useValue: httpMock },
        { provide: HttpErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(PollService);
    spyOn(localStorage, 'getItem').and.returnValue('test-token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get upcoming matches', () => {
    const matches = [{ opponent: 'Real Madrid' }];
    httpMock.get.and.returnValue(of(matches));

    service.getUpcomingMatches().subscribe(res => {
      expect(res).toEqual(matches);
    });
    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/matches');
  });

  it('should get all polls with auth header', () => {
    const polls = [{ question: 'Ki nyer?' }];
    httpMock.get.and.returnValue(of(polls));

    service.getAllPolls().subscribe(res => {
      expect(res).toEqual(polls);
    });
    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/poll', jasmine.any(Object));
  });

  it('should create a poll', () => {
    const pollData = { matchId: 'm1', questions: [{ question: 'Teszt?' }] };
    httpMock.post.and.returnValue(of({ success: true }));

    service.createPoll(pollData).subscribe(res => {
      expect(res).toEqual({ success: true });
    });
    expect(httpMock.post).toHaveBeenCalledWith('http://localhost:3000/api/poll', pollData, jasmine.any(Object));
  });

  it('should close a poll', () => {
    httpMock.patch.and.returnValue(of({ closed: true }));

    service.closePoll('p1').subscribe(res => {
      expect(res).toEqual({ closed: true });
    });
    expect(httpMock.patch).toHaveBeenCalledWith('http://localhost:3000/api/poll/p1/close', {}, jasmine.any(Object));
  });

  it('should delete a poll', () => {
    httpMock.delete.and.returnValue(of({ deleted: true }));

    service.deletePoll('p1').subscribe(res => {
      expect(res).toEqual({ deleted: true });
    });
    expect(httpMock.delete).toHaveBeenCalledWith('http://localhost:3000/api/poll/p1', jasmine.any(Object));
  });

  it('should evaluate a poll', () => {
    const evalData = { correctAnswers: ['A'] };
    httpMock.post.and.returnValue(of({ evaluated: true }));

    service.evaluatePoll('p1', evalData).subscribe(res => {
      expect(res).toEqual({ evaluated: true });
    });
    expect(httpMock.post).toHaveBeenCalledWith('http://localhost:3000/api/poll/p1/evaluate', evalData, jasmine.any(Object));
  });

  it('should vote on a poll', () => {
    const voteData = { questionIndex: 0, selectedOption: 'A' };
    httpMock.post.and.returnValue(of({ voted: true }));

    service.votePoll('p1', voteData).subscribe(res => {
      expect(res).toEqual({ voted: true });
    });
    expect(httpMock.post).toHaveBeenCalledWith('http://localhost:3000/api/poll/p1/vote', voteData, jasmine.any(Object));
  });

  it('should handle error on votePoll', () => {
    const error = new Error('hiba');
    httpMock.post.and.returnValue(throwError(() => error));
    errorHandlerMock.handleError.and.returnValue(throwError(() => error));

    service.votePoll('p1', { questionIndex: 0, selectedOption: 'A' }).subscribe({
      error: err => expect(err).toBe(error)
    });
    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(error);
  });
});
