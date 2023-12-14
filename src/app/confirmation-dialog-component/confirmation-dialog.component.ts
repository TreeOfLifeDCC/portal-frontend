
import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {
  }

  close(): void {
    this.dialogRef.close();
  }

  download(): void {
      const method = 'post';
      const downloadUrl = this.data.url;
      const form = document.createElement('form');
      form.setAttribute('method', method);
      form.setAttribute('action', downloadUrl);

      form.appendChild(this.makeInputField('result', 'read_run'));
      form.appendChild(this.makeInputField('accession', this.data.accession));
      form.appendChild(this.makeInputField('field', 'fastq_ftp'));

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
  }
    // tslint:disable-next-line:typedef
    private makeInputField(name: string, value: string) {
        const field = document.createElement('input');
        field.setAttribute('type', 'hidden');
        field.setAttribute('name', name);
        field.setAttribute('value', value);
        return field;
    }
}
