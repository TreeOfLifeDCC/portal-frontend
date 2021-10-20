import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent {

    // private API_BASE_URL = 'http://localhost:8080';
    public API_BASE_URL = 'http://45.86.170.227:30985';
    // private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';
    public sexPieChartLabels = [];
    public sexPieChartData = [];
    habitatPieChartLabels = [];
    organismPartPieChartLabels = [];
    organismPartPieChartData = [];
    lifestagePieChartLabels = [];
    lifestagePieChartData = [];
    habitatPieChartData = [];

    constructor(private http: HttpClient, route: ActivatedRoute) {
        // this.getStatusesFilters();
        // this.getFilterResults();
        this.getChartsData();

    }

    // tslint:disable-next-line:typedef
    public getChartsData() {
        this.http.get(this.API_BASE_URL + `/organisms/get-pie-chart-data`).subscribe(
            data => {
                // @ts-ignore
                data.sex.filter((i: any) => {

                    this.sexPieChartLabels.push(i.key.toLowerCase().replace(/([A-Z])/g, ' $1')
                        // uppercase the first character
                        .replace(/^./, (str) => str.toUpperCase()));

                    this.sexPieChartData.push(i.doc_count);

                });
                // @ts-ignore
                data.habitat.filter((i: any) => {
                    // @ts-ignore
                    this.habitatPieChartLabels.push(i.key.toLowerCase().replace(/([A-Z])/g, ' $1')
                        // uppercase the first character
                        .replace(/^./, (str) => str.toUpperCase()));
                    // @ts-ignore
                    this.habitatPieChartData.push(i.doc_count);

                });
                // @ts-ignore
                data.lifestage.filter((i: any) => {

                    this.lifestagePieChartLabels.push(i.key.toLowerCase().replace(/([A-Z])/g, ' $1')
                        // uppercase the first character
                        .replace(/^./, (str) => str.toUpperCase()));

                    this.lifestagePieChartData.push(i.doc_count);

                });

                // @ts-ignore
                data.organismPart.filter((i: any) => {

                    this.organismPartPieChartLabels.push(i.key.toLowerCase().replace(/([A-Z])/g, ' $1')
                        // uppercase the first character
                        .replace(/^./, (str) => str.toUpperCase()));

                    this.organismPartPieChartData.push(i.doc_count);

                });
            },
            (err: any) => console.log(err)
        );

    }
}
