import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { NewsService } from '../../../../shared/services/news.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockNewsService: jasmine.SpyObj<NewsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const fakeNews = [
    { _id: '1', title: 'Hír 1', content: 'Tartalom 1', imageUrl: 'img1.jpg' },
    { _id: '2', title: 'Hír 2', content: 'Tartalom 2', imageUrl: 'img2.jpg' },
    { _id: '3', title: 'Hír 3', content: 'Tartalom 3', imageUrl: 'img3.jpg' },
    { _id: '4', title: 'Hír 4', content: 'Tartalom 4', imageUrl: 'img4.jpg' }
  ];

  beforeEach(async () => {
    mockNewsService = jasmine.createSpyObj('NewsService', ['getNews']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule // ⬅️ Ez kell az animációs hibához
      ],
      providers: [
        { provide: NewsService, useValue: mockNewsService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    mockNewsService.getNews.and.returnValue(of(fakeNews));
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial news', () => {
    expect(component.newsList.length).toBe(4);
    expect(component.visibleNews.length).toBe(3);
  });

  it('should load more news', () => {
    component.loadMoreNews();
    expect(component.visibleNews.length).toBe(4);
  });

  it('should return true for hasMoreNews when not all loaded', () => {
    expect(component.hasMoreNews).toBeTrue();
  });

  it('should return true for canCollapse when more than itemsPerPage shown', () => {
    component.loadMoreNews();
    expect(component.canCollapse).toBeTrue();
  });

  it('should reset visibleNews on resetNews()', () => {
    component.loadMoreNews(); // 4 hír van
    component.resetNews();
    expect(component.visibleNews.length).toBe(3);
  });

  it('should navigate to detail page if id is provided', () => {
    component.goToDetail('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/news', '123']);
  });

  it('should NOT navigate if id is undefined', () => {
    component.goToDetail(undefined);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
