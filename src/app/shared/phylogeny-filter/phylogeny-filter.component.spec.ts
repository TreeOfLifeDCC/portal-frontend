import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhylogenyFilterComponent } from './phylogeny-filter.component';

describe('PhylogenyFilterComponent', () => {
  let component: PhylogenyFilterComponent;
  let fixture: ComponentFixture<PhylogenyFilterComponent>;

  beforeEach(async(() => {
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
