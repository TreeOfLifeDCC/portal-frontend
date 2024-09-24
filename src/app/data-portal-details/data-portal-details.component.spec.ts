
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataPortalDetailsComponent } from './data-portal-details.component';

describe('DashboardComponent', () => {
  let component: DataPortalDetailsComponent;
  let fixture: ComponentFixture<DataPortalDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPortalDetailsComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPortalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
