import {Component} from '@angular/core';
import {ChartOptions, ChartType} from '@rinminase/ng-charts';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-sex-distribution-chart',
    templateUrl: './sex-distribution.component.html',
    styleUrls: ['./sex-distribution.component.css']
})
export class SexDistributionComponent {
    private API_BASE_URL = 'http://45.86.170.227:30985';
    sexPieChartLabels = [];
    sexPieChartData = [];
    constructor(private http: HttpClient, route: ActivatedRoute) {
        this.getChartsData();
    }
    public pieChartType: ChartType = 'pie';
    public pieChartOptions: ChartOptions = {
        responsive: true,
    };
    public pieChartLegend = true;
    public pieChartPlugins = [];
    sexchartColors = [{
        backgroundColor: [
            'rgb(248,126,97)',
            'rgb(253,164,115)',
            '#4BBEFD',
            '#3f308f',
            '#d27484',
            '#dc556c',
            '#7cae85',
            '#857bb8',
            '#e3a3ad'
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
                data.sex.filter((i: any) => {
                    this.sexPieChartLabels.push(i.key.toLowerCase().replace(/([A-Z])/g, ' $1')
                        // uppercase the first character
                        .replace(/^./, (str) => str.toUpperCase()));
                    this.sexPieChartData.push(i.doc_count);

                });
            },
            (err: any) => console.log(err)
        );

    }
}


