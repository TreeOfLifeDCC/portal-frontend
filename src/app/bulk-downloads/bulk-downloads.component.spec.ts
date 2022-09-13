import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDownloadsComponent } from './bulk-downloads.component';

describe('BulkDownloadsComponent', () => {
  let component: BulkDownloadsComponent;
  let fixture: ComponentFixture<BulkDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
