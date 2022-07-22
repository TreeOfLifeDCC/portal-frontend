import { Component, AfterViewInit, Input } from '@angular/core';
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
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map;
  private tiles;
  private markers;

  @Input('lat') lat: any;
  @Input('lng') lng: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  private initMap(): void {
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var latlng = L.latLng(this.lat, this.lng);

    this.map = L.map('map', {
      center: latlng,
      zoom: 12,
      layers: [this.tiles]
    });

    this.markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false
    });

    this.markers.on('clusterclick', function (a) {
      a.layer.spiderfy();
    });

    this.getLatLong();
    this.map.addLayer(this.markers);
  }

  getLatLong(): any {
    if (this.lat != 'not collected' && this.lat != 'not provided') {
      var latlng = L.latLng(this.lat, this.lng);
      var m = L.marker(latlng);
      this.markers.addLayer(m);
    }
  }

}