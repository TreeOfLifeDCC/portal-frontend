import {Component, Inject, OnDestroy} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSort } from '@angular/material/sort';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource} from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'genome-note-list',
  templateUrl: './genome-note-list.component.html',
  styleUrls: ['./genome-note-list.component.scss'],
  standalone: true,
  imports:[MatTable,
    MatTable,
    MatSort,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef
  ]
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
