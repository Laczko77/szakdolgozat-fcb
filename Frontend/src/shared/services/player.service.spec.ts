import { TestBed } from '@angular/core/testing';
import { PlayerService, Player } from './player.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { of, throwError } from 'rxjs';

describe('PlayerService', () => {
  let service: PlayerService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let errorHandlerMock: jasmine.SpyObj<HttpErrorHandlerService>;

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    errorHandlerMock = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        PlayerService,
        { provide: HttpClient, useValue: httpMock },
        { provide: HttpErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(PlayerService);
  });

  const mockPlayer: Player = {
    _id: '1',
    name: 'Lewandowski',
    number: 9,
    position: 'Csatár',
    nationality: 'Lengyel',
    birthDate: '1988-08-21',
    imageUrl: 'lewa.jpg',
    appearances: 100,
    goals: 80,
    assists: 20,
    isCoach: false
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all players', () => {
    httpMock.get.and.returnValue(of([mockPlayer]));

    service.getAll().subscribe(players => {
      expect(players).toEqual([mockPlayer]);
    });

    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/players');
  });

  it('should create a player', () => {
    const formData = new FormData();
    httpMock.post.and.returnValue(of(mockPlayer));

    service.create(formData).subscribe(res => {
      expect(res).toEqual(mockPlayer);
    });

    expect(httpMock.post).toHaveBeenCalled();
  });

  it('should update a player', () => {
    const formData = new FormData();
    httpMock.put.and.returnValue(of(mockPlayer));

    service.update('1', formData).subscribe(res => {
      expect(res).toEqual(mockPlayer);
    });

    expect(httpMock.put).toHaveBeenCalledWith('http://localhost:3000/api/players/1', formData, jasmine.any(Object));
  });

  it('should delete a player', () => {
    httpMock.delete.and.returnValue(of({ success: true }));

    service.delete('1').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpMock.delete).toHaveBeenCalledWith('http://localhost:3000/api/players/1', jasmine.any(Object));
  });

  it('should get player by ID', () => {
    httpMock.get.and.returnValue(of(mockPlayer));

    service.getPlayerById('1').subscribe(res => {
      expect(res).toEqual(mockPlayer);
    });

    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/players/1');
  });

  it('should handle error on getAll', () => {
    const err = new Error('Hiba');
    httpMock.get.and.returnValue(throwError(() => err));
    errorHandlerMock.handleError.and.returnValue(throwError(() => err));

    service.getAll().subscribe({ error: e => expect(e).toBe(err) });
    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(err);
  });
});
