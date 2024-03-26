import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookerDashboardsComponent } from './looker-dashboards.component';

describe('LookerDashboardsComponent', () => {
  let component: LookerDashboardsComponent;
  let fixture: ComponentFixture<LookerDashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookerDashboardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LookerDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
