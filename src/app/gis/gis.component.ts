import {Component, AfterViewInit, Input, ViewChild, OnDestroy} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { GisService } from './gis.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {control} from 'leaflet';
import layers = control.layers;
import {MatRadioChange} from '@angular/material/radio';
import {FilterService} from '../services/filter-service';
import {ActivatedRoute, Params, Router} from '@angular/router';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;


@Component({
  selector: 'app-gis',
  templateUrl: './gis.component.html',
  styleUrls: ['./gis.component.css']
})
export class GisComponent implements AfterViewInit , OnDestroy {
  private map;
  private tiles;
  private markers;
  toggleSpecimen = new FormControl();
  selectedPhylogenyFilter;
  unpackedData;

  myControl = new FormControl('');
  filteredOptions: string[];
  radioOptions = 1;
  constructor(private gisService: GisService, private spinner: NgxSpinnerService, private activatedRoute: ActivatedRoute,
              private router: Router, public filterService: FilterService) { }

  ngOnInit(): void {
    this.toggleSpecimen.setValue(false);
    this.radioOptions = 1;
    const queryParamMap = this.activatedRoute.snapshot['queryParamMap'];
    const params = queryParamMap['params'];
    // tslint:disable-next-line:triple-equals
    if (Object.keys(params).length != 0) {

      this.resetFilter();
      // tslint:disable-next-line:forin
      for (const key in params) {
        this.filterService.urlAppendFilterArray.push({name: key, value: params[key]});
        if (key === 'experiment-type') {
          const list = params[key].split(',');
          list.forEach((param: any) => {
            this.filterService.activeFilters.push(param);
          });
        } else if (key == 'phylogeny') {
          this.filterService.isFilterSelected = true;
          this.filterService.phylSelectedRank = params[key];
          this.filterService.activeFilters.push(params[key]);

        } else {
          this.filterService.activeFilters.push(params[key]);
        }
      }
    }
    this.getGisData();
  }
  hasActiveFilters() {
    if (typeof this.filterService.activeFilters === 'undefined') {
      return false;
    }
    for (const key of Object.keys(this.filterService.activeFilters)) {
      if (this.filterService.activeFilters[key].length !== 0) {
        return true;
      }
    }
    return false;
  }

  ngAfterViewInit(): void {
  }

  filterSearchResults() {

    if (this.filterService.searchText != '' && this.filterService.searchText.length > 1) {
      const filterValue = this.filterService.searchText.toLowerCase();
      this.filteredOptions = this.unpackedData.filter(option => {
        if (option.id != undefined) {
          if (option.id.toLowerCase().includes(filterValue)) {
            return option.id;
          }
        }
      });
    }
    else {
      this.filteredOptions = [];
    }
  }
  // tslint:disable-next-line:typedef
  removeFilter() {
    this.resetFilter();
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl.split('?')[0]] );
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 800);
    });
  }
  toggleSpecimens(event: MatRadioChange) {
    if (event.value === 3) {
      // this.radioOptions = 3;
      this.spinner.show();
      this.refreshMapLayers();
      setTimeout(() => {
        this.setMarkers();
        this.getAllLatLong();
        this.map.addLayer(this.markers);
        if (this.myControl.value == ''){
          this.resetMapView();
        }
        this.spinner.hide();
      }, 50);
    } else  if (event.value === 1) {
      // this.radioOptions = 1;
      this.spinner.show();
      this.refreshMapLayers();
      setTimeout(() => {
        this.setMarkers();
        this.getSpecicesLatLong();
        this.map.addLayer(this.markers);
        if (this.myControl.value == ''){
          this.resetMapView();
        }
        this.spinner.hide();
      }, 50);
    }
  }

  getGisData() {
    this.spinner.show();
    this.gisService.getGisData(this.filterService.activeFilters.join(','), this.filterService.searchText)
      .subscribe(
        data => {
          const unpackedData = [];
          this.filterService.getFilters(data);
          for (const item of  data.hits.hits) {
            unpackedData.push(this.unpackData(item));
          }
          this.unpackedData = unpackedData;
          setTimeout(() => {
            this.spinner.hide();
            this.initMap();
            this.populateMap();
            this.showCursorCoordinates();
          }, 300);
        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      );
  }

  unpackData(data: any) {
    data = data._source;
    return data;
  }

  private initMap(): void {
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const latlng = L.latLng(53.4862, -1.8904);

    this.map = L.map('map', {
      center: latlng,
      zoom: 6,
      layers: [this.tiles],
    });
  }

  populateMap() {
    this.setMarkers();
    this.getSpecicesLatLong();
    this.map.addLayer(this.markers);
  }

  setMarkers() {
    this.markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: false
    });

    this.markers.on('clusterclick', function(a) {
      const childCluster = a.layer._childClusters;
      if (childCluster.length <= 1) {
        a.layer.spiderfy();
      }
    });
  }

  getSpecicesLatLong(): any {
    const orgGeoSize = this.unpackedData.length;
    for (let i = 0; i < orgGeoSize; i++) {
      if (Object.keys(this.unpackedData[i]).length !== 0) {

        const tempArr = this.unpackedData[i].organisms;

        const tempArrSize = tempArr === undefined ? 0 : tempArr.length;

        for (let j = 0; j < tempArrSize; j++) {
          if (tempArr[j].lat != 'not collected' && tempArr[j].lat != 'not provided') {
            let llat: any;
            let llng: any;
            if (tempArr[j].lat == '67.34.07' && tempArr[j].lng == '68.07.30') {
              llat = '67.3407';
              llng = '68.0730';
            } else {
              llat = tempArr[j].lat;
              llng = tempArr[j].lng;
            }
            const latlng = L.latLng(llat, llng);

            let alreadyExists = false;
            if ((this.markers !== undefined && this.markers.getLayers() !== undefined)) {
              this.markers.getLayers().forEach((layer) => {
                if (!alreadyExists && layer instanceof L.Marker && (layer.getLatLng().equals(latlng)) && layer.options.title === tempArr[j].organism) {
                  alreadyExists = true;
                }
              });
            }
            let popupcontent = '';
            if (!alreadyExists) {
              const m = L.marker(latlng);
              const organismString = encodeURIComponent(tempArr[j].organism.toString());
              const organism = `<div><a target="_blank" href=/data/root/details/${organismString}>${tempArr[j].organism}</a></div>`;
              const commonName = tempArr[j].commonName != null ? `<div>${tempArr[j].commonName}</div>` : '';
              popupcontent = organism + commonName ;
              const popup = L.popup({
                closeOnClick: false,
                autoClose: true,
                closeButton: false
              }).setContent(popupcontent);
              m.options.title = tempArr[j].organism;
              m.bindPopup(popup);
              this.markers.addLayer(m);
              // }
              // });
            }
          }
        }
      }
    }
  }
  getAllLatLong(): any {
    const orgGeoSize = this.unpackedData.length;

    for (let i = 0; i < orgGeoSize; i++) {
      if (Object.keys(this.unpackedData[i]).length !== 0) {
        const tempArr = this.unpackedData[i].organisms;

        const tempArrSize = tempArr === undefined ? 0 : tempArr.length;
        for (let j = 0; j < tempArrSize; j++) {
          if (tempArr[j].lat != 'not collected' && tempArr[j].lat != 'not provided') {
            let llat: any;
            let llng: any;
            if (tempArr[j].lat == '67.34.07' && tempArr[j].lng == '68.07.30') {
              llat = '67.3407';
              llng = '68.0730';
            }
            else {
              llat = tempArr[j].lat;
              llng = tempArr[j].lng;
            }
            const latlng = L.latLng(llat, llng);
            let popupcontent = '';
            const m = L.marker(latlng);
            const organismString = encodeURIComponent(tempArr[j].organism.toString());
            const organism = `<div><a target="_blank" href=/data/root/details/${organismString}>${tempArr[j].organism}</a></div>`;
            const commonName = tempArr[j].commonName != null ? `<div>${tempArr[j].commonName}</div>` : '';
            popupcontent = organism + commonName ;
            const popup = L.popup({
              closeOnClick: false,
              autoClose: true,
              closeButton: false
            }).setContent(popupcontent);
            m.options.title = tempArr[j].organism;
            m.bindPopup(popup);
            this.markers.addLayer(m);
            // }
            // });

          }
        }
      }
    }

    const specGeoSize = this.unpackedData.length;
    for (let i = 0; i < specGeoSize; i++) {
      if (Object.keys(this.unpackedData[i]).length != 0 ) {
        const tempspecArr = this.unpackedData[i].specimens;
        const tempspecArrSize = tempspecArr === undefined ? 0 : tempspecArr.length;
        for (let j = 0; j < tempspecArrSize; j++) {
          if (tempspecArr[j].lat != 'not collected' && tempspecArr[j].lat != 'not provided') {
            let llat: any;
            let llng: any;
            if (tempspecArr[j].lat == '67.34.07' && tempspecArr[j].lng == '68.07.30') {
              llat = '67.3407';
              llng = '68.0730';
            }
            else {
              llat = tempspecArr[j].lat;
              llng = tempspecArr[j].lng;
            }
            const latlng = L.latLng(llat, llng);
            const m = L.marker(latlng);
            const accession = `<div><a target="_blank" href=/data/specimens/details/${tempspecArr[j].accession}>${tempspecArr[j].accession}</a></div>`;
            const organism = tempspecArr[j].organism != null ? `<div>${tempspecArr[j].organism}</div>` : '';
            const commonName = tempspecArr[j].commonName != null ? `<div>${tempspecArr[j].commonName}</div>` : '';
            const organismPart = `<div>${tempspecArr[j].organismPart}</div>`;
            const popupcontent = accession + organism + commonName + organismPart;
            const popup = L.popup({
              closeOnClick: false,
              autoClose: true,
              closeButton: false
            }).setContent(popupcontent);
            m.bindPopup(popup);
            this.markers.addLayer(m);
          }
        }
      }
    }
  }

  showCursorCoordinates() {
    const Coordinates = L.Control.extend({
      onAdd: map => {
        const container = L.DomUtil.create('div');
        container.style.backgroundColor = 'rgba(255,255,255,.8)';
        map.addEventListener('mousemove', e => {
          container.innerHTML = `Lat: ${e.latlng.lat.toFixed(4)} Lng: ${e.latlng.lng.toFixed(4)}`;
        });
        return container;
      }
    });
    this.map.addControl(new Coordinates({ position: 'bottomright' }));
  }

  refreshMapLayers() {
    this.map.eachLayer(layer => {
      this.map.removeLayer(layer);
    });
    this.map.addLayer(this.tiles);
  }

  resetMapView = () => {
    this.map.setView([53.4862, -1.8904], 6);
  }

  searchGisData = () => {
    this.getSearchData(this.filterService.searchText);
  }

  getSearchData(search: any) {
    this.toggleSpecimen.setValue(false);
    this.radioOptions = 1;
    this.spinner.show();
    this.gisService.getGisData(this.filterService.activeFilters.join(','), search)
      .subscribe(
        data => {
          this.filterService.getFilters(data);
          this.filterService.updateActiveRouteParams();
          const unpackedData = [];
          this.unpackedData = [];
          for (const item of data.hits.hits) {
            unpackedData.push(this.unpackData(item));
          }
          this.unpackedData = unpackedData;
          this.refreshMapLayers();
          setTimeout(() => {
            this.populateMap();
            if (this.unpackedData.length > 0) {
              const lat = this.unpackedData[0].organisms[0].lat;
              const lng = this.unpackedData[0].organisms[0].lng;
              this.map.setView([lat, lng], 6);
            }
            else {
              this.resetMapView();
            }
            this.spinner.hide();
          }, 100);
        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      );

  }

  removeInputAndGetAllData() {
    this.toggleSpecimen.setValue(false);
    this.radioOptions = 1;
    this.getAllData();
  }

  getAllData() {
    this.filteredOptions = [];
    this.myControl.reset();
    this.spinner.show();
    this.gisService.getGisData(this.filterService.activeFilters.join(','), this.filterService.searchText)
      .subscribe(
        data => {
          this.filterService.getFilters(data);
          const unpackedData = [];
          this.unpackedData = [];
          for (const item of data.hits.hits) {
            unpackedData.push(this.unpackData(item));
          }
          this.unpackedData = unpackedData;
          this.refreshMapLayers();
          setTimeout(() => {
            this.populateMap();
            this.resetMapView();
            this.spinner.hide();
          }, 400);
        },
        err => {
          console.log(err);
          this.spinner.hide();
        }
      );
  }
  resetFilter = () => {
    for (const key of Object.keys(this.filterService.activeFilters)) {
      this.filterService.activeFilters[key] = [];
    }
    this.filterService.activeFilters = [];
    this.filterService.urlAppendFilterArray = [];
    this.filterService.isFilterSelected = false;
    this.filterService.phylSelectedRank = '';
    this.filterService.selectedFilterValue = '';
  }

  ngOnDestroy() {
    this.resetFilter();
  }
}
