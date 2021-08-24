import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';

@Component({
  selector: 'app-phylogenetics',
  templateUrl: './phylogenetics.component.html',
  styleUrls: ['./phylogenetics.component.css']
})
export class PhylogeneticsComponent implements OnInit {

  constructor(private dynamicScriptLoader: DynamicScriptLoaderService, route: ActivatedRoute) {
    this.loadScripts();
   }

  ngOnInit() {
  }
  
  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dynamicScriptLoader.load('d3min', 'd3tree').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }


}
