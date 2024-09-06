
// @ts-ignore
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule as MatDialogModule, MatDialogRef as MatDialogRef, MatDialog as MatDialog } from '@angular/material/dialog';


import { ConfirmationDialogComponent } from './confirmation-dialog.component';


describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
      ],
      declarations: [ ConfirmationDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
