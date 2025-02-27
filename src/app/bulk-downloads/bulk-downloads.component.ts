import { Component, OnInit } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';


@Component({
  selector: 'app-bulk-downloads',
  templateUrl: './bulk-downloads.component.html',
  styleUrls: ['./bulk-downloads.component.css'],
  standalone: true,
  imports:[NgxSpinnerModule]
})
export class BulkDownloadsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
