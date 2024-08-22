import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
    MatCell,
    MatCellDef, MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable,
    MatTableDataSource
} from '@angular/material/table';
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'genome-note-list',
    templateUrl: './genome-note-list.component.html',
    standalone: true,
    imports: [
        MatHeaderCell,
        MatTable,
        MatHeaderCellDef,
        MatCellDef,
        MatCell,
        MatColumnDef,
        MatHeaderRow,
        MatRow,
        MatRowDef,
        MatHeaderRowDef,
        MatButton
    ],
    styleUrls: ['./genome-note-list.component.scss']
})
export class GenomeNoteListComponent implements OnDestroy {
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
