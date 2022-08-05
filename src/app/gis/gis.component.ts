import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
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
export class GisComponent implements AfterViewInit {
  private map;
  private tiles;
  private markers;
  toggleSpecimen = new FormControl();

  unpackedData;

  myControl = new FormControl('');
  filteredOptions: string[];
  radioOptions = 1;
  constructor(private gisService: GisService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.toggleSpecimen.setValue(false);
    this.radioOptions = 1;
    this.getGisData();
  }

  ngAfterViewInit(): void {
  }

  filterSearchResults(value: string) {
    if (value != '' && value.length > 1) {
      const filterValue = value.toLowerCase();
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
    }else if (event.value === 2){
      // this.radioOptions = 2;
      this.spinner.show();
      this.refreshMapLayers();
      setTimeout(() => {
        this.setMarkers();
        this.getOrganismLatLong();
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
    this.gisService.getgisData()
      .subscribe(
        data => {
          const unpackedData = [];
          for (const item of data) {
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

  getOrganismLatLong(): any {
    const orgGeoSize = this.unpackedData.length;
    for (let i = 0; i < orgGeoSize; i++) {
      if (Object.keys(this.unpackedData[i]).length != 0) {
        const tempArr = this.unpackedData[i].organisms;
        const tempArrSize = tempArr.length;
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

            const m = L.marker(latlng);
            const accession = `<div><a target="_blank" href=/data/organism/details/${tempArr[j].accession}>${tempArr[j].accession}</a></div>`;
            const organism = tempArr[j].organism != null ? `<div>${tempArr[j].organism}</div>` : '';
            const commonName = tempArr[j].commonName != null ? `<div>${tempArr[j].commonName}</div>` : '';
            const organismPart = `<div>${tempArr[j].organismPart}</div>`;
            const popupcontent = accession + organism + commonName + organismPart;
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


  getSpecicesLatLong(): any {
    const orgGeoSize = this.unpackedData.length;
    for (let i = 0; i < orgGeoSize; i++) {
      if (Object.keys(this.unpackedData[i]).length != 0) {
        const tempArr = this.unpackedData[i].organisms;
        const tempArrSize = tempArr.length;
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
      if (Object.keys(this.unpackedData[i]).length != 0) {
        const tempArr = this.unpackedData[i].organisms;
        const tempArrSize = tempArr.length;
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
            const m = L.marker(latlng);
            const accession = `<div><a target="_blank" href=/data/organism/details/${tempArr[j].accession}>${tempArr[j].accession}</a></div>`;
            const organism = tempArr[j].organism != null ? `<div>${tempArr[j].organism}</div>` : '';
            const commonName = tempArr[j].commonName != null ? `<div>${tempArr[j].commonName}</div>` : '';
            const organismPart = `<div>${tempArr[j].organismPart}</div>`;
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

    const specGeoSize = this.unpackedData.length;
    for (let i = 0; i < specGeoSize; i++) {
      if (Object.keys(this.unpackedData[i]).length != 0) {
        const tempspecArr = this.unpackedData[i].specimens;
        const tempspecArrSize = tempspecArr.length;
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

  resetMapView() {
    this.map.setView([53.4862, -1.8904], 6);
  }

  searchGisData(searchText) {
    this.getSearchData(searchText);
  }

  getSearchData(search: any) {
    this.toggleSpecimen.setValue(false);
    this.radioOptions = 1;
    if (search.length > 0) {
      this.spinner.show();
      this.gisService.getGisSearchData(search)
        .subscribe(
          data => {
            const unpackedData = [];
            this.unpackedData = [];
            for (const item of data) {
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
    else {
      this.getAllData();
    }
  }

  removeInputAndGetAllData() {
    this.toggleSpecimen.setValue(false);
    this.getAllData();
  }

  getAllData() {
    this.filteredOptions = [];
    this.myControl.reset();
    this.spinner.show();
    this.gisService.getgisData()
      .subscribe(
        data => {
          const unpackedData = [];
          this.unpackedData = [];
          for (const item of data) {
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

}
