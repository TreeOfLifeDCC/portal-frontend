import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingSystemComponent } from './tracking-system.component';

describe('TrackingSystemComponent', () => {
  let component: TrackingSystemComponent;
  let fixture: ComponentFixture<TrackingSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingSystemComponent ]
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
