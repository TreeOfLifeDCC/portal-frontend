import {Component} from '@angular/core';
import {ChartOptions, ChartType} from '@rinminase/ng-charts';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-organisms-part-chart',
    templateUrl: './organisms-part.component.html',
    styleUrls: ['./organisms-part.component.css']
})
export class OrganismsPartComponent {
    private API_BASE_URL = 'http://45.86.170.227:30985';

    constructor(private http: HttpClient, route: ActivatedRoute) {
        this.getChartsData();
    }

    public pieChartType: ChartType = 'pie';
    organismChartColors = [{
        backgroundColor: [
            'rgb(219,75,104)',
            '#857bb8',
            '#e3a3ad',
            '#94ccc2',
            '#e3a3ad',
            '#4BBEFD',
            '#3f308f',
            '#d27484',
            '#dc556c'
        ],
        borderWidth: 1,
        borderColor: 'white',
        hoverBorderWidth: 2,
        hoverBorderColor: 'grey',
        options: {
            title: {
                display: true,
                text: 'Habitat Pie Chart',
                fontSize: 25
            },
            legend: {
                display: true,
                position: 'right',
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips: {
                enabled: true
            }
        }
    }];
    public pieChartOptions: ChartOptions = {
        responsive: true,
    };
    public pieChartLegend = true;
    public pieChartPlugins = [];
    organismPartPieChartLabels = [];
    organismPartPieChartData = [];

    // tslint:disable-next-line:typedef
    public getChartsData() {
        this.http.get(this.API_BASE_URL + `/organisms/get-pie-chart-data`).subscribe(
            data => {
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


