import {Component, Inject, OnDestroy} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DashboardService} from '../dashboard/services/dashboard.service';

@Component({
  selector: 'download-confirmation-dialog',
  templateUrl: './download-confirmation-dialog.component.html',
  styleUrls: ['./download-confirmation-dialog.component.scss']
})
export class DownloadConfirmationDialogComponent implements  OnDestroy {
  radioOptions: string;
  constructor(private dashboardService: DashboardService, public dialogRef: MatDialogRef<DownloadConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }



  private DOWNLOAD_URL = 'https://portal.darwintreeoflife.org/files/';
  close(): void {
    this.dialogRef.close();
  }

  download(): void {
    const method = 'post';
    let downloadUrl = '';
    if (this.radioOptions == 'assemblies') {
      downloadUrl = this.DOWNLOAD_URL + 'assemblies';

      const form = document.createElement('form');
      form.setAttribute('method', method);
      form.setAttribute('action', downloadUrl);

      form.appendChild(this.makeInputField('taxonomyFilter', JSON.stringify(this.data.taxonomy[0])));
      if (this.data.activeFilters != null && this.data.activeFilters.length > 0) {
        form.appendChild(this.makeInputField('filter', this.data.activeFilters));
      } else {
        form.appendChild(this.makeInputField('filter', "None"));

      }
      form.appendChild(this.makeInputField('downloadOption', this.radioOptions));
      form.appendChild(this.makeInputField('taxonId', this.radioOptions));

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } else if (this.radioOptions == 'annotation') {
      downloadUrl = this.DOWNLOAD_URL + 'annotations';
      const form = document.createElement('form');
      form.setAttribute('method', method);
      form.setAttribute('action', downloadUrl);

      form.appendChild(this.makeInputField('taxonomyFilter', JSON.stringify(this.data.taxonomy[0])));

      if (this.data.activeFilters != null && this.data.activeFilters.length > 0) {
        form.appendChild(this.makeInputField('filter', this.data.activeFilters));
      } else {
        form.appendChild(this.makeInputField('filter', "None"));

      }
      form.appendChild(this.makeInputField('downloadOption', this.radioOptions));
      form.appendChild(this.makeInputField('taxonId', this.radioOptions));

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } else {
      this.dashboardService.download(this.data.activeFilters.toString(), this.data.sort.active, this.data.sort.direction, 0, 5000, this.data.taxonomy, this.data.searchText, this.radioOptions).subscribe(data => {
        const blob = new Blob([data], {type: 'application/csv'});
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = this.radioOptions + '.csv';
        link.click();
      }), error => console.log('Error downloading the file'),
          () => console.info('File downloaded successfully');

    }
  }
  private makeInputField(name: string, value: string) {
    const field = document.createElement('input');
    field.setAttribute('type', 'hidden');
    field.setAttribute('name', name);
    field.setAttribute('value', value);
    return field;
  }
  ngOnDestroy(): void {
    this.dialogRef.close();
  }
}
