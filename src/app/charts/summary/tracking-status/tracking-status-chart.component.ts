import {Component} from '@angular/core';
import {ChartOptions, ChartType, SingleDataSet} from '@rinminase/ng-charts';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";


@Component({
    selector: 'app-tracking-status-chart',
    templateUrl: './tracking-status-chart.component.html',
    styleUrls: ['./tracking-status-chart.component.css']
})
export class TrackingStatusChartComponent {
    private API_BASE_URL = 'http://45.86.170.227:30985';

    constructor(private http: HttpClient, route: ActivatedRoute) {
        this.getStatusesFilters();
    }

    public pieChartLabels = [];
    public pieChartType: ChartType = 'pie';
    public pieChartOptions: ChartOptions = {
        responsive: true,
    };
    filtersMap: any;
    public pieChartPlugins = [];
    public pieChartLegend = true;
    public pieChartData: SingleDataSet = [];
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
    private getStatusesFilters() {
        this.http.get(this.API_BASE_URL + `/statuses/filters`).subscribe(
            data => {
                this.filtersMap = data;
                this.filtersMap.biosamples.filter((i: any) => {
                    if (i !== '' && i.key.includes('- Done')) {
                        this.pieChartData.push(i.doc_count);
                        this.pieChartLabels.push('Biosamples - Submitted');
                    }
                });
                this.filtersMap.raw_data.filter((i: any) => {
                    if (i !== '' && i.key.includes('- Done')) {
                        this.pieChartData.push(i.doc_count);
                        this.pieChartLabels.push('Raw data');
                    }
                });
                this.filtersMap.mapped_reads.filter((i: any) => {
                    if (i !== '' && i.key.includes('- Done')) {
                        this.pieChartData.push(i.doc_count);
                        this.pieChartLabels.push('Mapped Reads');
                    }
                });
                this.filtersMap.assemblies.filter((i: any) => {
                    if (i !== '' && i.key.includes('- Done')) {
                        this.pieChartData.push(i.doc_count);
                        this.pieChartLabels.push('Assemblies');
                    }
                });
                this.filtersMap.annotation_complete.filter((i: any) => {
                    if (i !== '' && i.key.includes('- Done')) {
                        this.pieChartData.push(i.doc_count);
                        this.pieChartLabels.push('Annotation Complete');
                    }
                });
                this.filtersMap.annotation.filter((i: any) => {
                    if (i !== '' && i.key.includes('- Done')) {
                        this.pieChartData.push(i.doc_count);
                        this.pieChartLabels.push('Annotation');
                    }
                });
            },
            (err: any) => console.log(err)
        );

    }
}
