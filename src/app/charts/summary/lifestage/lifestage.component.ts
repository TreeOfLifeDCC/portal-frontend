import {Component} from '@angular/core';
import {ChartOptions, ChartType} from '@rinminase/ng-charts';
import {ChartDataSets} from 'chart.js';
import {SummaryComponent} from '../summary.component';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-lifestage-chart',
    templateUrl: './lifestage.component.html',
    styleUrls: ['./lifestage.component.css']
})
export class LifestageComponent {
    private API_BASE_URL = 'http://45.86.170.227:30985';

    constructor(private http: HttpClient, route: ActivatedRoute) {
        this.getChartsData();
    }
    public pieChartType: ChartType = 'pie';
    public pieChartOptions: ChartOptions = {
        responsive: true,
    };
    public pieChartLegend = true;
    public pieChartPlugins = [];
    lifestagePieChartLabels = [];
    lifestagePieChartData = [];
    lifestageChartColors = [{
        backgroundColor: [
            'rgb(112,30,127)',
            'rgb(241,109,97)',
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
    // tslint:disable-next-line:typedef
    public getChartsData() {
        this.http.get(this.API_BASE_URL + `/organisms/get-pie-chart-data`).subscribe(
            data => {
                // @ts-ignore
                data.lifestage.filter((i: any) => {
                    this.lifestagePieChartLabels.push(i.key.toLowerCase().replace(/([A-Z])/g, ' $1')
                        // uppercase the first character
                        .replace(/^./, (str) => str.toUpperCase()));
                    this.lifestagePieChartData.push(i.doc_count);

                });

            },
            (err: any) => console.log(err)
        );

    }
}


