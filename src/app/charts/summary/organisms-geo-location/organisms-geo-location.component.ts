import {AfterViewInit, Component} from '@angular/core';
import * as L from 'leaflet';
import {map} from 'leaflet';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-organisms-geo-location',
    templateUrl: './organisms-geo-location.component.html',
    styleUrls: ['./organisms-geo-location.component.css']
})
export class OrganismsGeoLocationComponent implements AfterViewInit {
    map: any;
    dataList: [];
    private API_BASE_URL = 'http://45.86.170.227:30985';
    markerLocations = [];

    constructor(private http: HttpClient, route: ActivatedRoute) {
        this.getGeoLocation();
    }

    // tslint:disable-next-line:typedef
    ngAfterViewInit() {
        this.map = map('map').setView([54.607868, -5.926437], 5.5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);


    }

    // tslint:disable-next-line:typedef
    getGeoLocation(){
        this.http.get(this.API_BASE_URL + `/organisms/get-geo-locations`).toPromise()
            .then(
        data => {
            // @ts-ignore
            for (const item of data) {
                // @ts-ignore
                this.markerLocations.push(item);
            }
            this.addMarkers();

        });
    }

    // tslint:disable-next-line:typedef
    addMarkers() {
        const icon = L.icon({
            iconUrl: 'assets/images/marker-icon.png',
            shadowUrl: 'assets/images/marker-shadow.png',

            iconSize: [20, 20], // size of the icon
            shadowSize: [20, 20], // size of the shadow
            iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62], // the same for the shadow
            popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor


        });

        this.markerLocations.forEach(t => {
            L.marker([t.coordinates[1], t.coordinates[0]], { icon })
                .addTo(this.map)
                .bindPopup('<a href=/data/organism/details/' + t.id + '>' + t.id + '</a>'
            );
        });
    }

}
