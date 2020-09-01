import {Component, OnInit, ViewChild} from '@angular/core';
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
export class TrackingSystemComponent implements OnInit {
  displayedColumns = ['Organism', 'Common name', 'Metadata submitted to BioSamples',
    'Raw data submitted to ENA', 'Mapped reads submitted to ENA', 'Assemblies submitted to ENA',
    'Annotation submitted to ENA'];
  dataSource = new MatTableDataSource<Sample>(samples);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {}) sort: MatSort;

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Tracking system');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterProduct(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
