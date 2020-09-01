import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Sample, samples } from '../model/tracking-system.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-tracking-system',
  templateUrl: './tracking-system.component.html',
  styleUrls: ['./tracking-system.component.css']
})
export class TrackingSystemComponent implements OnInit, AfterViewInit {
  displayedColumns = ['organism', 'common_name', 'metadata_submitted_to_biosamples',
    'raw_data_submitted_to_ena', 'mapped_reads_submitted_to_ena', 'assemblies_submitted_to_ena',
    'annotation_submitted_to_ena'];
  dataSource = new MatTableDataSource<Sample>(samples);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Tracking system');
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
