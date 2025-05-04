import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchListComponent } from './match-list.component';
import { Match, MatchService } from '../../../../shared/services/match.service';
import { AnalyticsService } from '../../../../shared/services/analytics.service';
import { of, Subject, throwError } from 'rxjs';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { QueryList } from '@angular/core';

describe('MatchListComponent', () => {
  let component: MatchListComponent;
  let fixture: ComponentFixture<MatchListComponent>;
  let mockMatchService: jasmine.SpyObj<MatchService>;
  let mockAnalyticsService: jasmine.SpyObj<AnalyticsService>;

  const mockMatches: Match[] = [
    {
      _id: '1',
      date: '2025-05-05',
      competition: 'La Liga',
      matchday: '35',
      opponent: 'Real Madrid',
      home: 'home' as 'home',
      score: '2-1'
    },
    {
      _id: '2',
      date: '2025-05-12',
      competition: 'La Liga',
      matchday: '36',
      opponent: 'Atletico Madrid',
      home: 'away' as 'away'
    }
  ];
  
  beforeEach(async () => {
    mockMatchService = jasmine.createSpyObj('MatchService', ['getAll']);
    mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', ['sendButtonClick']);
  
    // ✅ FONTOS: mock visszatérés még a component létrehozása előtt!
    mockMatchService.getAll.and.returnValue(of(mockMatches));
  
    await TestBed.configureTestingModule({
      declarations: [MatchListComponent],
      providers: [
        { provide: MatchService, useValue: mockMatchService },
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  
    fixture = TestBed.createComponent(MatchListComponent);
    component = fixture.componentInstance;
  
    // 🔧 IntersectionObserver mock
    (window as any).IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  
    const dummyElementRef = { nativeElement: document.createElement('div') } as ElementRef;
    const fakeQueryList = {
      forEach: (cb: (el: ElementRef) => void) => cb(dummyElementRef),
      changes: of([{ nativeElement: document.createElement('div') }])
    } as unknown as QueryList<ElementRef>;
  
    component.fadeElements = fakeQueryList;
  });
  
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load matches and group them by month', () => {
    mockMatchService.getAll.and.returnValue(of(mockMatches));
    component.loadMatches();

    expect(component.allMatches.length).toBe(2);
    expect(Object.keys(component.groupedMatches).length).toBeGreaterThan(0);
  });

  it('should handle error when loading matches fails', () => {
    spyOn(console, 'error');
    mockMatchService.getAll.and.returnValue(throwError(() => new Error('Hiba')));
    component.loadMatches();
    expect(console.error).toHaveBeenCalledWith('Hiba a meccsek betöltésekor:', jasmine.any(Error));
  });

  it('should format team string correctly', () => {
    const homeMatch: Match = { ...mockMatches[0], home: 'home' as 'home' };
    const awayMatch: Match = { ...mockMatches[0], home: 'away' as 'away' };
    const neutralMatch: Match = { ...mockMatches[0], home: 'neutral' as 'neutral' };
  
    expect(component.formatTeams(homeMatch)).toContain('FC Barcelona');
    expect(component.formatTeams(awayMatch)).toContain('FC Barcelona');
    expect(component.formatTeams(neutralMatch)).toContain('FC Barcelona');
  });
  

  it('should select and close match overlay', () => {
    const match = mockMatches[0];
    component.selectMatch(match);
    expect(component.selectedMatch).toEqual(match);

    component.closeOverlay();
    expect(component.selectedMatch).toBeNull();
  });

  it('should format numeric matchdays correctly', () => {
    expect(component.formatMatchday('35')).toBe('35 forduló');
    expect(component.formatMatchday('Elődöntő')).toBe('Elődöntő');
  });

  it('should send analytics event on button click', () => {
    component.onButtonClick();
    expect(mockAnalyticsService.sendButtonClick).toHaveBeenCalledWith('Jegyvásárlás oldal');
  });

  it('should initialize IntersectionObserver without error', () => {
    fixture.detectChanges();
    expect(() => component.ngAfterViewInit()).not.toThrow();
  });
});
