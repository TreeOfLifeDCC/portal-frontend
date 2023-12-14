import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhylogeneticsComponent } from './phylogenetics.component';

describe('PhylogeneticsComponent', () => {
  let component: PhylogeneticsComponent;
  let fixture: ComponentFixture<PhylogeneticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhylogeneticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhylogeneticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
