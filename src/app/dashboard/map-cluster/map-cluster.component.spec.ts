import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapClusterComponent } from './map-cluster.component';

describe('MapClusterComponent', () => {
  let component: MapClusterComponent;
  let fixture: ComponentFixture<MapClusterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapClusterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
