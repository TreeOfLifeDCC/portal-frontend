import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sample, samples } from '../../../dashboard/model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator as MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { StatusesService } from '../../services/statuses.service';


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

  displayedColumnsFiles = ['study_accession', 'experiment_accession', 'run_accession', 'fastq_ftp', 'submitted_ftp',
    'instrument_platform', 'instrument_model', 'library_layout', 'library_strategy', 'library_source',
    'library_selection'];
  displayedColumnsAssemblies = ['accession', 'assembly_name', 'description', 'version'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private route: ActivatedRoute, private statusesService: StatusesService) {
    this.route.params.subscribe(param => this.bioSampleId = param.organism);
    this.getBiosamples();
  }

  // tslint:disable-next-line:typedef
  getBiosamples() {
    this.statusesService.getBiosampleByOrganism(this.bioSampleId)
      .subscribe(
        data => {
          this.bioSampleObj = data;
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

  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFiles.filter = filterValue.trim().toLowerCase();
  }

}
