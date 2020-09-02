import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sample, samples } from '../../model/dashboard.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  public bioSampleId;
  public bioSampleObj;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(param => this.bioSampleId = param.id);
    samples.filter(sample => {
      if (sample['accession'] == this.bioSampleId)
        this.bioSampleObj = sample
    });

    console.log(this.bioSampleObj.customField);
  }

  ngOnInit(): void {
  }

}
