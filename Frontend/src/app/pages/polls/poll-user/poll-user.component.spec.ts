import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollUserComponent } from './poll-user.component';
import { PollService } from '../../../../shared/services/poll.service';
import { AnalyticsService } from '../../../../shared/services/analytics.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('PollUserComponent', () => {
  let component: PollUserComponent;
  let fixture: ComponentFixture<PollUserComponent>;
  let mockPollService: jasmine.SpyObj<PollService>;
  let mockAnalyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async () => {
    mockPollService = jasmine.createSpyObj('PollService', ['getAllPolls', 'votePoll']);
    mockAnalyticsService = jasmine.createSpyObj('AnalyticsService', ['sendButtonClick']);

    await TestBed.configureTestingModule({
      declarations: [PollUserComponent],
      imports: [FormsModule],
      providers: [
        { provide: PollService, useValue: mockPollService },
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
      
    }).compileComponents();

    fixture = TestBed.createComponent(PollUserComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    mockPollService.getAllPolls.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return empty string for invalid token', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(component.getUserId()).toBe('');
  });

  it('should return userId from token', () => {
    const fakeToken = 'header.' + btoa(JSON.stringify({ userId: 'u123' })) + '.sig';
    spyOn(localStorage, 'getItem').and.returnValue(fakeToken);
    expect(component.getUserId()).toBe('u123');
  });

  it('should load and filter open polls on init', () => {
    const mockPolls = [
      {
        isClosed: false,
        questions: [
          {
            question: 'Teszt kérdés',
            answers: []
          }
        ]
      },
      {
        isClosed: true,
        questions: []
      }
    ];

    spyOn(component, 'getUserId').and.returnValue('u123');
    mockPollService.getAllPolls.and.returnValue(of(mockPolls));
    fixture.detectChanges();

    expect(component.polls.length).toBe(1);
    expect(component.polls[0].questions[0].hasVoted).toBeFalse();
  });

  it('should handle error if getAllPolls fails', () => {
    mockPollService.getAllPolls.and.returnValue(throwError(() => new Error('Hiba')));
    fixture.detectChanges();
    expect(component.polls).toEqual([]);
  });

  it('should store selected answer correctly', () => {
    component.selectAnswer('poll1', 0, 'B');
    expect(component.selectedAnswers['poll1_0']).toBe('B');
  });

  it('should set error message if no option is selected on submit', () => {
    component.selectedAnswers = {}; // nincs kiválasztva semmi
    component.submitVote('poll1', 0);
    expect(component.message).toBe('Kérlek válassz egy opciót!');
  });

  it('should submit vote and reload polls', () => {
    spyOn(component, 'loadPolls');
    mockPollService.votePoll.and.returnValue(of({}));
    component.selectedAnswers['poll1_0'] = 'A';
    component.submitVote('poll1', 0);
    expect(component.message).toBe('Szavazat sikeresen leadva!');
    expect(component.loadPolls).toHaveBeenCalled();
  });

  it('should handle error on votePoll', () => {
    mockPollService.votePoll.and.returnValue(
      throwError(() => ({ error: { error: 'Szavazási hiba!' } }))
    );
    component.selectedAnswers['poll1_0'] = 'A';
    component.submitVote('poll1', 0);
    expect(component.message).toBe('Szavazási hiba!');
  });

  it('should call sendButtonClick when button clicked', () => {
    component.onButtonClick();
    expect(mockAnalyticsService.sendButtonClick).toHaveBeenCalledWith('Szavazat leadása');
  });
});
