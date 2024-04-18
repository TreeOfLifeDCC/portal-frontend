import {Component, Inject, OnDestroy} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'genome-note-list',
  templateUrl: './genome-note-list.component.html',
  styleUrls: ['./genome-note-list.component.scss']
})
export class GenomeNoteListComponent implements  OnDestroy {
  dataSource = new MatTableDataSource<any>();
  columns = ['title'];
  constructor(public dialogRef: MatDialogRef<GenomeNoteListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSource = data.genomNotes;

  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }
}
