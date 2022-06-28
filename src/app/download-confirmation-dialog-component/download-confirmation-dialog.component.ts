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
