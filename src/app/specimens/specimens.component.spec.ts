import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpecimensComponent } from './specimens.component';

describe('SpecimensComponent', () => {
  let component: SpecimensComponent;
  let fixture: ComponentFixture<SpecimensComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecimensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecimensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
