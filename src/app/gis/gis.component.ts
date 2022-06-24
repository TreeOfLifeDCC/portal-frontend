import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import orgGeoJson from './organisms-gis.json';
import specGeoJson from './specimens-gis.json';

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

  orgGeoList = orgGeoJson;
  specGeoList = specGeoJson;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 400);
  }
  private initMap(): void {
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var latlng = L.latLng(53.4862, -1.8904);

    this.map = L.map('map', {
      center: latlng,
      zoom: 6,
      layers: [this.tiles],
    });

    this.markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: false
    });

    this.markers.on('clusterclick', function (a) {
      const childCluster = a.layer._childClusters;
      if (childCluster.length <= 1) {
        a.layer.spiderfy();
      }
    });

    this.getLatLong();
    this.showCursorCoordinates();
    this.map.addLayer(this.markers);
  }

  getLatLong(): any {
    let orgGeoSize = this.orgGeoList.length
    for (var i = 0; i < orgGeoSize; i++) {
      let tempArr = this.orgGeoList[i];
      let tempArrSize = tempArr.length
      for (var j = 0; j < tempArrSize; j++) {
        if (tempArr[j].lat != 'not collected' && tempArr[j].lat != 'not provided') {
          const llat: any = tempArr[j].lat
          const llng: any = tempArr[j].lng
          const latlng = L.latLng(llat, llng);
          const m = L.marker(latlng);
          const accession = `<div><a target="_blank" href=/data/organism/details/${tempArr[j].accession}>${tempArr[j].accession}</a></div>`;
          const commonName = tempArr[j].commonName != null ? `<div>${tempArr[j].commonName}</div>` : '';
          const organismPart = `<div>${tempArr[j].organismPart}</div>`;
          const popupcontent = accession + commonName + organismPart;
          const popup = L.popup({
            closeOnClick: false,
            autoClose: true,
            closeButton: false
          }).setContent(popupcontent);

          m.bindPopup(popup)
          this.markers.addLayer(m);
        }
      }
    }

    let specGeoSize = this.specGeoList.length
    for (var i = 0; i < specGeoSize; i++) {
      let tempspecArr = this.specGeoList[i];
      let tempspecArrSize = tempspecArr.length
      for (var j = 0; j < tempspecArrSize; j++) {
        if (tempspecArr[j].lat != 'not collected' && tempspecArr[j].lat != 'not provided') {
          const llat: any = tempspecArr[j].lat
          const llng: any = tempspecArr[j].lng
          const latlng = L.latLng(llat, llng);
          const m = L.marker(latlng);
          const accession = `<div><a target="_blank" href=/data/specimens/details/${tempspecArr[j].accession}>${tempspecArr[j].accession}</a></div>`;
          const commonName = tempspecArr[j].commonName != null ? `<div>${tempspecArr[j].commonName}</div>` : '';
          const organismPart = `<div>${tempspecArr[j].organismPart}</div>`;
          const popupcontent = accession + commonName + organismPart;
          const popup = L.popup({
            closeOnClick: false,
            autoClose: true,
            closeButton: false
          }).setContent(popupcontent);
          m.bindPopup(popup)
          this.markers.addLayer(m);
        }
      }
    }
  }

  showCursorCoordinates() {
    const Coordinates = L.Control.extend({
      onAdd: map => {
        const container = L.DomUtil.create("div");
        container.style.backgroundColor = "rgba(255,255,255,.8)";
        map.addEventListener("mousemove", e => {
          container.innerHTML = `Lat: ${e.latlng.lat.toFixed(4)} Lng: ${e.latlng.lng.toFixed(4)}`;
        });
        return container;
      }
    });
    this.map.addControl(new Coordinates({ position: "bottomright" }));
  }

}