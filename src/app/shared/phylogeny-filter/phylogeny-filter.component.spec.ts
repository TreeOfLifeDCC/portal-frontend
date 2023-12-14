import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhylogenyFilterComponent } from './phylogeny-filter.component';

describe('PhylogenyFilterComponent', () => {
  let component: PhylogenyFilterComponent;
  let fixture: ComponentFixture<PhylogenyFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhylogenyFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhylogenyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
