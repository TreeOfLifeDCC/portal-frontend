import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganismDetailsComponent } from './organism-details.component';

// @ts-ignore
describe('DetailsComponent', () => {
  let component: OrganismDetailsComponent;
  let fixture: ComponentFixture<OrganismDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [OrganismDetailsComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
