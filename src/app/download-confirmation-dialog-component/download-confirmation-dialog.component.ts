import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DashboardService} from '../dashboard/services/dashboard.service';

@Component({
  selector: 'download-confirmation-dialog',
  templateUrl: './download-confirmation-dialog.component.html',
  styleUrls: ['./download-confirmation-dialog.component.scss']
})
export class DownloadConfirmationDialogComponent {
  radioOptions: string;
  constructor(private dashboardService: DashboardService, public dialogRef: MatDialogRef<DownloadConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  close(): void {
    this.dialogRef.close();
  }

  download(): void {

    const method = 'post';
    let downloadUrl ='';
    if(this.radioOptions=='assemblies') {
      downloadUrl = 'https://portal.darwintreeoflife.org/files/assemblies/';
    }else {
      downloadUrl = 'https://portal.darwintreeoflife.org/files/annotations';
    }
    const form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', downloadUrl);

    form.appendChild(this.makeInputField( 'taxonomyFilter',JSON.stringify(this.data.taxonomy[0])));

    form.appendChild(this.makeInputField('downloadOption', this.radioOptions));


    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

  }
  private makeInputField(name: string, value: string) {
    const field = document.createElement('input');
    field.setAttribute('type', 'hidden');
    field.setAttribute('name', name);
    field.setAttribute('value', value);
    return field;
  }
}
