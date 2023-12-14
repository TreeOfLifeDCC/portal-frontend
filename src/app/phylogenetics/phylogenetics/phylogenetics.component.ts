import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import { UntypedFormControl } from '@angular/forms';
import {MatLegacyRadioChange as MatRadioChange} from '@angular/material/legacy-radio';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-phylogenetics',
  templateUrl: './phylogenetics.component.html',
  styleUrls: ['./phylogenetics.component.css']
})
export class PhylogeneticsComponent implements OnInit {

  toggleSpecimen = new UntypedFormControl();
  radioOptions = 1;


  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, route: ActivatedRoute, private spinner: NgxSpinnerService) {
   }

  ngOnInit() {
    this.toggleSpecimen.setValue(false);
    this.radioOptions = 1;
  }

  ngAfterViewInit(): void {
    this.loadScripts();
  }

  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dynamicScriptLoader.load('d3min', 'd3tree',  'autocomplete').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }

  // toggleSpecimens(event: MatRadioChange) {
  //   this.spinner.show();
  //     setTimeout(() => {
  //       this.loadScripts();
  //       this.spinner.hide();
  //     }, 50);
  //   }

}
