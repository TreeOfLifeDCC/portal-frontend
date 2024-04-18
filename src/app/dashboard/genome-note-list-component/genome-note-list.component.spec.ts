// @ts-ignore
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule as MatDialogModule, MatDialogRef as MatDialogRef, MatDialog as MatDialog } from '@angular/material/dialog';

// @ts-ignore
import { AppModule } from '../../app.module';
import { GenomeNoteListComponent} from './genome-note-list.component';


describe('GenomeNoteListComponent', () => {
  let component: GenomeNoteListComponent;
  let fixture: ComponentFixture<GenomeNoteListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        AppModule,
      ],
      declarations: [ GenomeNoteListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenomeNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
