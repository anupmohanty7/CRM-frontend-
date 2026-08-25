import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMLayoutComponent } from './crmlayout.component';

describe('CRMLayoutComponent', () => {
  let component: CRMLayoutComponent;
  let fixture: ComponentFixture<CRMLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CRMLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CRMLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
