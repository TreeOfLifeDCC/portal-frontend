import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import { FormControl, FormsModule } from '@angular/forms';
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-phylogenetics',
  templateUrl: './phylogenetics.component.html',
  styleUrls: ['./phylogenetics.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    NgxSpinnerModule
],
providers: [
DynamicScriptLoaderService
]
})
export class PhylogeneticsComponent implements OnInit {

  toggleSpecimen = new FormControl();
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
