import { TestBed } from '@angular/core/testing';
import { ForumService } from './forum.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { AuthService } from './auth.service';

describe('ForumService', () => {
  let service: ForumService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let errorHandlerSpy: jasmine.SpyObj<HttpErrorHandlerService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete', 'request']);
    errorHandlerSpy = jasmine.createSpyObj('HttpErrorHandlerService', ['handleError']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('fake-token');

    TestBed.configureTestingModule({
      providers: [
        ForumService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: HttpErrorHandlerService, useValue: errorHandlerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(ForumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get posts', () => {
    const mockPosts = [{ _id: '1', text: 'Hello' }];
    httpSpy.get.and.returnValue(of(mockPosts));

    service.getPosts().subscribe(res => {
      expect(res).toEqual(mockPosts);
    });

    expect(httpSpy.get).toHaveBeenCalled();
  });

  it('should create a post', () => {
    const formData = new FormData();
    httpSpy.post.and.returnValue(of({ success: true }));

    service.createPost(formData).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpSpy.post).toHaveBeenCalled();
  });

  it('should update a post', () => {
    const formData = new FormData();
    httpSpy.put.and.returnValue(of({ success: true }));

    service.updatePost('1', formData).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpSpy.put).toHaveBeenCalledWith('http://localhost:3000/api/forum/1', formData, jasmine.any(Object));
  });

  it('should delete a post', () => {
    httpSpy.delete.and.returnValue(of({ success: true }));

    service.deletePost('1').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpSpy.delete).toHaveBeenCalledWith('http://localhost:3000/api/forum/1', jasmine.any(Object));
  });

  it('should like a post', () => {
    httpSpy.post.and.returnValue(of({ success: true }));

    service.likePost('1').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpSpy.post).toHaveBeenCalledWith('http://localhost:3000/api/forum/1/like', {}, jasmine.any(Object));
  });

  it('should add a comment', () => {
    httpSpy.post.and.returnValue(of({ success: true }));

    service.addComment('1', 'Nice post').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpSpy.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/forum/1/comment',
      { text: 'Nice post' },
      jasmine.any(Object)
    );
  });

  it('should delete a comment', () => {
    httpSpy.request.and.returnValue(of({ success: true }));

    service.deleteComment('1', 'c1').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpSpy.request).toHaveBeenCalledWith('delete', 'http://localhost:3000/api/forum/1/comment', {
      headers: jasmine.any(Object),
      body: { commentId: 'c1' }
    });
  });

  it('should update a comment', () => {
    httpSpy.put.and.returnValue(of({ success: true }));

    service.updateComment('1', 'c1', 'Updated').subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    expect(httpSpy.put).toHaveBeenCalledWith(
      'http://localhost:3000/api/forum/1/comment',
      { commentId: 'c1', text: 'Updated' },
      jasmine.any(Object)
    );
  });

  it('should handle error on getPosts', () => {
    const error = new Error('Hiba');
    httpSpy.get.and.returnValue(throwError(() => error));
    errorHandlerSpy.handleError.and.returnValue(throwError(() => error));

    service.getPosts().subscribe({ error: err => expect(err).toBe(error) });

    expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(error);
  });
});
