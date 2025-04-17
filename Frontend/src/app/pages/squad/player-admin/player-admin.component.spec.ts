import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAdminComponent } from './player-admin.component';

describe('PlayerAdminComponent', () => {
  let component: PlayerAdminComponent;
  let fixture: ComponentFixture<PlayerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
