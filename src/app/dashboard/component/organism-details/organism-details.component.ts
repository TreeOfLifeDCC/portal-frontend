import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sample, samples } from '../../model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'dashboard-organism-details',
  templateUrl: './organism-details.component.html',
  styleUrls: ['./organism-details.component.css']
})
export class OrganismDetailsComponent implements OnInit, AfterViewInit {

  bioSampleId: string;
  bioSampleObj;
  dataSourceRecords;
  bioSampleTotalCount;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['accession', 'organism', 'commonName', 'sex', 'organismPart', 'trackingSystem'];

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService) {
    this.route.params.subscribe(param => this.bioSampleId = param.id);
  }

  ngOnInit(): void {
    if (this.bioSampleId.includes('SAME')) {
      this.getBiosampleById();
    }
    else {
      this.getBiosampleByOrganism();
    }

  }

  ngAfterViewInit(): void {
  }

  // tslint:disable-next-line:typedef
  getBiosampleById() {
    this.dashboardService.getRootsampleByAccession(this.bioSampleId)
      .subscribe(
        data => {
          const unpackedData = [];
          this.bioSampleObj = data;
          for (const item of data.records) {
            unpackedData.push(this.unpackData(item));
          }
          setTimeout(() => {
            this.dataSourceRecords = new MatTableDataSource<any>(unpackedData);
            this.bioSampleTotalCount = unpackedData.length;
            this.dataSourceRecords.sort = this.sort;
            this.dataSourceRecords.paginator = this.paginator;
          }, 500)
        },
        err => console.log(err)
      );
  }

  getBiosampleByOrganism() {
    this.dashboardService.getRootsampleByOrganism(this.bioSampleId)
      .subscribe(
        data => {
          const unpackedData = [];
          this.bioSampleObj = data;
          for (const item of data.records) {
            unpackedData.push(this.unpackData(item));
          }
          setTimeout(() => {
            this.dataSourceRecords = new MatTableDataSource<any>(unpackedData);
            this.bioSampleTotalCount = unpackedData.length;
            this.dataSourceRecords.sort = this.sort;
            this.dataSourceRecords.paginator = this.paginator;
          }, 500)
        },
        err => console.log(err)
      );
  }

  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRecords.filter = filterValue.trim().toLowerCase();
  }

  unpackData(data: any) {
    const dataToReturn = {};
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'object') {
        if (key === 'organism') {
          dataToReturn[key] = data.organism.text;
        }
      } else {
        dataToReturn[key] = data[key];
      }
    }
    return dataToReturn;
  }

  getStatusClass(status: string) {
    if (status === 'annotation complete') {
      return 'badge badge-pill badge-success';
    } else {
      return 'badge badge-pill badge-warning'
    }
  }

}
