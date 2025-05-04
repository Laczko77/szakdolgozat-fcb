import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsDetailComponent } from './news-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NewsService } from '../../../../shared/services/news.service';

describe('NewsDetailComponent', () => {
  let component: NewsDetailComponent;
  let fixture: ComponentFixture<NewsDetailComponent>;
  let mockNewsService: jasmine.SpyObj<NewsService>;

  beforeEach(async () => {
    mockNewsService = jasmine.createSpyObj('NewsService', ['getNewsById']);

    await TestBed.configureTestingModule({
      declarations: [NewsDetailComponent],
      providers: [
        { provide: NewsService, useValue: mockNewsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'abc123'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load news on init', () => {
    const mockNews = {
      _id: 'abc123',
      title: 'Teszt hír',
      content: 'Ez egy teszt tartalom.',
      imageUrl: 'https://example.com/image.jpg'
    };

    mockNewsService.getNewsById.and.returnValue(of(mockNews));
    component.ngOnInit();
    expect(component.newsItem).toEqual(mockNews);
  });
});

describe('NewsDetailComponent without ID', () => {
  let component: NewsDetailComponent;
  let fixture: ComponentFixture<NewsDetailComponent>;
  let mockNewsService: jasmine.SpyObj<NewsService>;

  beforeEach(async () => {
    mockNewsService = jasmine.createSpyObj('NewsService', ['getNewsById']);

    await TestBed.configureTestingModule({
      declarations: [NewsDetailComponent],
      providers: [
        { provide: NewsService, useValue: mockNewsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsDetailComponent);
    component = fixture.componentInstance;
  });

  it('should not crash if ID is missing in route', () => {
    expect(() => component.ngOnInit()).not.toThrow();
    expect(component.newsItem).toBeUndefined();
  });

  it('should not call getNewsById if no ID is present', () => {
    component.ngOnInit();
    expect(mockNewsService.getNewsById).not.toHaveBeenCalled();
  });

  it('should leave newsItem undefined if service returns nothing', () => {
    mockNewsService.getNewsById.and.returnValue(of(undefined as any));
    component.ngOnInit();
    expect(component.newsItem).toBeUndefined();
  });
});
