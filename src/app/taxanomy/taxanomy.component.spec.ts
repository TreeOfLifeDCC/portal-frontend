import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaxanomyComponent } from './taxanomy.component';

describe('TaxanomyComponent', () => {
  let component: TaxanomyComponent;
  let fixture: ComponentFixture<TaxanomyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [TaxanomyComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxanomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
