import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sample, samples } from '../../model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  bioSampleId;
  bioSampleObj;
  dataSourceFiles;
  dataSourceAssemblies;

  displayedColumnsFiles = ['study_accession', 'experiment_accession', 'run_accession', 'tax_id',
      'scientific_name', 'fastq_ftp', 'submitted_ftp'];
  displayedColumnsAssemblies = ['accession', 'assembly_name', 'description', 'version'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService) {
    this.route.params.subscribe(param => this.bioSampleId = param.id);
    this.getBiosamples();
  }

  // tslint:disable-next-line:typedef
  getBiosamples() {
    this.dashboardService.getBiosampleByAccession(this.bioSampleId)
      .subscribe(
        data => {
          console.log(data);
          this.bioSampleObj = data.hits.hits[0]._source;
          this.dataSourceFiles = new MatTableDataSource<Sample>(this.bioSampleObj.experiment);
          this.dataSourceAssemblies = new MatTableDataSource<any>(this.bioSampleObj.assemblies);
          this.dataSourceFiles.paginator = this.paginator;
          this.dataSourceFiles.sort = this.sort;
        },
        err => console.log(err)
      );
  }

  ngOnInit(): void {
  }

}
