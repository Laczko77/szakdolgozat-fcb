import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollUserComponent } from './poll-user.component';

describe('PollUserComponent', () => {
  let component: PollUserComponent;
  let fixture: ComponentFixture<PollUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
