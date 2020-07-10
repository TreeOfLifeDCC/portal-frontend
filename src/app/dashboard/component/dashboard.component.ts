import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Sample, samples } from '../model/dashboard.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayedColumns = ['column1', 'column2', 'column3', 'column4', 'column5'];
  dataSource = new MatTableDataSource<Sample>(samples);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {}) sort: MatSort;

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    // set title
    this.titleService.setTitle('Dashboard');
  }

  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterProduct(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
