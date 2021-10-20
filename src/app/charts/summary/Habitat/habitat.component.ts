import {Component} from '@angular/core';
import {ChartOptions, ChartType} from '@rinminase/ng-charts';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-habitat-chart',
    templateUrl: './habitat.component.html',
    styleUrls: ['./habitat.component.css']
})
export class HabitatComponent {
    private API_BASE_URL = 'http://45.86.170.227:30985';

    constructor(private http: HttpClient, route: ActivatedRoute) {
        this.getChartsData();
    }

    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;
    public pieChartPlugins = [];
    habitatPieChartLabels = [];
    habitatPieChartData = [];
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

    public pieChartOptions: ChartOptions = {
        responsive: true,
    };

    // tslint:disable-next-line:typedef
    public getChartsData() {
        this.http.get(this.API_BASE_URL + `/organisms/get-pie-chart-data`).subscribe(
            data => {

                // @ts-ignore
                data.habitat.filter((i: any) => {
                    // @ts-ignore
                    this.habitatPieChartLabels.push(i.key.toLowerCase().replace(/([A-Z])/g, ' $1')
                        // uppercase the first character
                        .replace(/^./, (str) => str.toUpperCase()));
                    // @ts-ignore
                    this.habitatPieChartData.push(i.doc_count);

                });
            });

    }
}


