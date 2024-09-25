// @ts-ignore
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule as MatDialogModule, MatDialogRef as MatDialogRef, MatDialog as MatDialog } from '@angular/material/dialog';

// @ts-ignore
import { AppModule } from '../../app.module';
import { DownloadConfirmationDialogComponent } from './download-confirmation-dialog.component';
import { OverlayRef } from '@angular/cdk/overlay';

describe('ConfirmationDialogComponent', () => {
  let component: DownloadConfirmationDialogComponent;
  let fixture: ComponentFixture<DownloadConfirmationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        AppModule,
      ],
      declarations: [ DownloadConfirmationDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
