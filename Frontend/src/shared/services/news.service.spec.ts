import { TestBed } from '@angular/core/testing';
import { NewsService, News } from './news.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { of, throwError } from 'rxjs';

describe('NewsService', () => {
  let service: NewsService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let errorHandlerMock: jasmine.SpyObj<HttpErrorHandlerService>;

  beforeEach(() => {
    httpMock = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    errorHandlerMock = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        NewsService,
        { provide: HttpClient, useValue: httpMock },
        { provide: HttpErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(NewsService);
  });

  const mockNews: News = {
    _id: '1',
    title: 'Teszt Hír',
    content: 'Ez egy teszt hír tartalma.',
    imageUrl: 'test.jpg'
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all news', () => {
    httpMock.get.and.returnValue(of([mockNews]));

    service.getNews().subscribe(news => {
      expect(news).toEqual([mockNews]);
    });

    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/news');
  });

  it('should get news by ID', () => {
    httpMock.get.and.returnValue(of(mockNews));

    service.getNewsById('1').subscribe(news => {
      expect(news).toEqual(mockNews);
    });

    expect(httpMock.get).toHaveBeenCalledWith('http://localhost:3000/api/news/1');
  });

  it('should create news', () => {
    const formData = new FormData();
    httpMock.post.and.returnValue(of(mockNews));

    service.createNews(formData).subscribe(res => {
      expect(res).toEqual(mockNews);
    });

    expect(httpMock.post).toHaveBeenCalledWith('http://localhost:3000/api/news', formData);
  });

  it('should update news', () => {
    const formData = new FormData();
    httpMock.put.and.returnValue(of(mockNews));

    service.updateNews('1', formData).subscribe(res => {
      expect(res).toEqual(mockNews);
    });

    expect(httpMock.put).toHaveBeenCalledWith('http://localhost:3000/api/news/1', formData);
  });

  it('should delete news', () => {
    httpMock.delete.and.returnValue(of({ success: true }));

    service.deleteNews('1').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpMock.delete).toHaveBeenCalledWith('http://localhost:3000/api/news/1');
  });

  it('should handle error on getNews', () => {
    const err = new Error('Hiba');
    httpMock.get.and.returnValue(throwError(() => err));
    errorHandlerMock.handleError.and.returnValue(throwError(() => err));

    service.getNews().subscribe({ error: e => expect(e).toBe(err) });
    expect(errorHandlerMock.handleError).toHaveBeenCalledWith(err);
  });
});
