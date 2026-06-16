import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';

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
  selector: 'app-mapcluster',
  standalone: true,
  templateUrl: './map-cluster.component.html',
  styleUrls: ['./map-cluster.component.css']
})
export class MapClusterComponent implements AfterViewInit {
  private map;
  private tiles;
  private markers;

  @Input('orgGeoList') orgGeoList: any;
  @Input('specGeoList') specGeoList: any;

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
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let latCoo = this.orgGeoList[0].lat;
    let lngCoo = this.orgGeoList[0].lng;
    var latlng = L.latLng(53.4862, -1.8904);
    if (latCoo != 'not collected' && latCoo != 'not provided') {
      latlng = L.latLng(latCoo, lngCoo);
    }

    this.map = L.map('map', {
      center: latlng,
      zoom: 5,
      layers: [this.tiles],
    });

    this.markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      removeOutsideVisibleBounds: false
    });

    this.markers.on('clusterclick', function (a) {
      a.layer.spiderfy();
    });

    this.getLatLong();
    this.showCursorCoordinates();
    this.map.addLayer(this.markers);
  }

  getLatLong(): any {
    let orgGeoSize = this.orgGeoList.length
    for (var i = 0; i < orgGeoSize; i++) {
      if (this.orgGeoList[i].lat != 'not collected' && this.orgGeoList[i].lat != 'not provided') {
        const latlng = L.latLng(this.orgGeoList[i].lat, this.orgGeoList[i].lng);
        const m = L.marker(latlng);
        const popupcontent = this.buildPopupContent(
          `/organism/${encodeURIComponent(this.orgGeoList[i].accession)}`,
          this.orgGeoList[i].accession,
          this.orgGeoList[i].commonName,
          this.orgGeoList[i].organismPart
        );
        const popup = L.popup({
          closeOnClick: false,
          autoClose: true,
          closeButton: false
        }).setContent(popupcontent);

        m.bindPopup(popup)
        this.markers.addLayer(m);
      }
    }

    let specGeoSize = this.specGeoList.length
    for (var i = 0; i < specGeoSize; i++) {
      if (this.specGeoList[i].lat != 'not collected' && this.specGeoList[i].lat != 'not provided') {
        const latlng = L.latLng(this.specGeoList[i].lat, this.specGeoList[i].lng);
        const m = L.marker(latlng);
        const popupcontent = this.buildPopupContent(
          `/data/specimens/details/${encodeURIComponent(this.specGeoList[i].accession)}`,
          this.specGeoList[i].accession,
          this.specGeoList[i].commonName,
          this.specGeoList[i].organismPart
        );
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

  // Builds the marker popup using DOM APIs and textContent so that
  // backend-supplied values (accession, commonName, organismPart) can never
  // be interpreted as HTML. Leaflet renders a string argument to setContent()
  // as raw innerHTML, bypassing Angular's sanitizer, so we pass an element.
  private buildPopupContent(href: string, accession: any, commonName: any, organismPart: any): HTMLElement {
    const container = document.createElement('div');

    const accessionDiv = document.createElement('div');
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = href;
    link.textContent = accession != null ? String(accession) : '';
    accessionDiv.appendChild(link);
    container.appendChild(accessionDiv);

    if (commonName != null) {
      const commonNameDiv = document.createElement('div');
      commonNameDiv.textContent = String(commonName);
      container.appendChild(commonNameDiv);
    }

    const organismPartDiv = document.createElement('div');
    organismPartDiv.textContent = organismPart != null ? String(organismPart) : '';
    container.appendChild(organismPartDiv);

    return container;
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
