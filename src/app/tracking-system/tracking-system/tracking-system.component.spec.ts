import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrackingSystemComponent } from './tracking-system.component';

describe('TrackingSystemComponent', () => {
  let component: TrackingSystemComponent;
  let fixture: ComponentFixture<TrackingSystemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [TrackingSystemComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
