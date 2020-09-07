import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sample, samples } from '../../model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, AfterViewInit {

  bioSampleId;
  bioSampleObj;
  dataSource;

  displayedColumns = ['study_accession', 'sample_accession', 'experiment_accession', 'run_accession', 'tax_id', 'scientific_name', 'fastq_ftp', 'submitted_ftp'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(param => this.bioSampleId = param.id);
    samples.filter(sample => {
      if (sample['accession'] == this.bioSampleId)
        this.bioSampleObj = sample
    });
    this.dataSource = new MatTableDataSource<Sample>(this.bioSampleObj.experiment);
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
