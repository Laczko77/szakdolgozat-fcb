import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchAdminComponent } from './match-admin.component';

describe('MatchAdminComponent', () => {
  let component: MatchAdminComponent;
  let fixture: ComponentFixture<MatchAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
