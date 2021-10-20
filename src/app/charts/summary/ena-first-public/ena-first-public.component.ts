import {Component} from '@angular/core';
import {ChartOptions, ChartType, SingleDataSet} from '@rinminase/ng-charts';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {ChartDataSets} from "chart.js";


@Component({
    selector: 'app-ena-first-public-chart',
    templateUrl: './ena-first-public.component.html',
    styleUrls: ['./ena-first-public.component.css']
})
export class EnaFirstPublicComponent {
    private API_BASE_URL = 'http://45.86.170.227:30985';

    constructor(private http: HttpClient, route: ActivatedRoute) {
        this.getFirstPublicChartsData();
    }
    public lineChartType: ChartType = 'line';
    firstPubliclineChartLabels = [];
    firstPubliclineChartData = [];
    public lineChartData: ChartDataSets[] = [{ data: [] }];
    chartColors = [{
        backgroundColor: [
            'rgb(253,200,139)',
            'rgb(241,109,97)',
            '#7cae85',
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
                text: 'Pie Chart',
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
    lineChartOptions = {
        responsive: true,
        fill: {
            target: 'origin',
            above: 'rgb(255, 0, 0)',   // Area will be red above the origin
            below: 'rgb(0, 0, 255)'    // And blue below the origin
        }
    };


    lineChartLegend = {
        title: {
            display: true,
            text: 'Habitat Pie Chart',
            fontSize: 25
        },
    };


// tslint:disable-next-line:typedef
    private getFirstPublicChartsData() {
        this.http.get(this.API_BASE_URL + `/organisms/get-count-first-public`).subscribe(
            data => {
                // @ts-ignore
                data.filter((i: any) => {
                    this.firstPubliclineChartLabels.push(i.enaFirstPublic);
                    this.firstPubliclineChartData.push(i.count);

                });
                // @ts-ignore
                this.lineChartData = [{data: this.firstPubliclineChartData, label: 'ENA First Public'}];
            });

    }
}


