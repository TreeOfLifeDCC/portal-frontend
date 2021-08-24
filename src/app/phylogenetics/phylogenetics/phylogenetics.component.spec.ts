import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhylogeneticsComponent } from './phylogenetics.component';

describe('PhylogeneticsComponent', () => {
  let component: PhylogeneticsComponent;
  let fixture: ComponentFixture<PhylogeneticsComponent>;

  beforeEach(async(() => {
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
