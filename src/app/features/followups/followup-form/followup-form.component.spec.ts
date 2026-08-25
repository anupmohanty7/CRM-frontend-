import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupFormComponent } from './followup-form.component';

describe('FollowupFormComponent', () => {
  let component: FollowupFormComponent;
  let fixture: ComponentFixture<FollowupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowupFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FollowupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
