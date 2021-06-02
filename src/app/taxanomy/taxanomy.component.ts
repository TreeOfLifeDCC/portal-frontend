import { Component, OnInit } from '@angular/core';
import { TaxanomyService } from './taxanomy.service';
import { Taxonomy } from './taxonomy.model';

@Component({
  selector: 'app-taxanomy',
  templateUrl: './taxanomy.component.html',
  styleUrls: ['./taxanomy.component.css']
})
export class TaxanomyComponent implements OnInit {

  taxonomies: any;
  
  childTaxanomy: Taxonomy;
  selectedTaxonomy: any;

  constructor(private taxanomyService: TaxanomyService) { }

  ngOnInit(): void {
    this.selectedTaxonomy = [];
    // this.initTaxonomyObject();
  }

  initTaxonomyObject() {
    this.childTaxanomy = {
      cellularorganism: [{ parent: 'Root', rank: 'superkingdom', expanded: false, childData: [{ key: 'Eukaryota', doc_count: '1', commonName: {buckets:[]} }] }],
      superkingdom: [],
      kingdom: [],
      subkingdom: [],
      superphylum: [],
      phylum: [],
      subphylum: [],
      superclass: [],
      class: [],
      subclass: [],
      infraclass: [],
      cohort: [],
      subcohort: [],
      superorder: [],
      order: [],
      parvorder: [],
      suborder: [],
      infraorder: [],
      section: [],
      subsection: [],
      superfamily: [],
      family: [],
      subfamily: [],
      tribe: [],
      subtribe: [],
      genus: [],
      series: [],
      subgenus: [],
      species_group: [],
      species_subgroup: [],
      species: [],
      subspecies: [],
      varietas: [],
      forma: []
    };
  }

  toggleTaxanomy(rank, taxonomy) {
    $('#' + rank).toggleClass("active");
    $('#' + taxonomy).toggleClass("caret-down");
  }

  getChildTaxonomyRank(rank: string, taxonomy: string, childRank: string) {
    this.taxanomyService.getChildTaxonomyRank('',rank, taxonomy, childRank, '', 'data').subscribe(
      data => {
        this.selectedTaxonomy.push(taxonomy);
        this.parseAndPushTaxaData(rank, data);
        setTimeout(() => {
          $('.' + taxonomy).toggleClass("active");
          $('#' + taxonomy).toggleClass("caret-down");
        }, 50);
      },
      err => {
        console.log(err);
      })
  }

  parseAndPushTaxaData(rank, data) {
    let temp = this.childTaxanomy[rank];
    if(temp.length > 0) {
      if (!(temp.filter(function(e) { return e.parent === data[rank].parent; }).length > 0)) {
        this.childTaxanomy[rank].push(data[rank]);
      }
    }
    else {
      this.childTaxanomy[rank].push(data[rank]);
    }
  }

  getTaxanomyFilters(taxonomy?: String) {
    this.taxanomyService.getTaxonomyFilters(taxonomy).subscribe(
      data => {
        this.taxonomies = data;
      },
      err => {
        console.log(err);
      })
  }

}
