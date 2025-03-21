
// @ts-ignore
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule as MatDialogModule, MatDialogRef as MatDialogRef, MatDialog as MatDialog } from '@angular/material/dialog';

import { AppModule } from '../app.module';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { OverlayRef } from '@angular/cdk/overlay';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialog: MatDialog;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        MatDialogModule,
        AppModule,
    ],
    declarations: [ConfirmationDialogComponent],
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
