import {Component} from '@angular/core';
import {ChartOptions, ChartType} from '@rinminase/ng-charts';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';


@Component({
    selector: 'app-kingdom-chart',
    templateUrl: './kingdom.component.html',
    styleUrls: ['./kingdom.component.css']
})
export class KingdomComponent {
    private API_BASE_URL = 'http://45.86.170.227:30985';
    constructor(private http: HttpClient, route: ActivatedRoute) {

        this.getFilterResults();

    }
    public pieChartType: ChartType = 'pie';
    kingdomMap: any;
    kingdompieChartLabels = [];
    kingdompieChartData = [];
    firstPubliclineChartData = [];
    public pieChartOptions: ChartOptions = {
        responsive: true,
    };
    public pieChartLegend = true;
    public pieChartPlugins = [];
    kingdomChartColors = [{
        backgroundColor: [
            'rgb(188,58,118)',
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
    // tslint:disable-next-line:typedef
    public getFilterResults() {
        const requestParams = 'taxonomy=Eukaryota&childRank=kingdom&filter=&type=status';

        const requestURL = `${this.API_BASE_URL}/taxonomy/superkingdom/child?${requestParams}`;
        return this.http.post(`${requestURL}`, []).subscribe(
            data => {
                // @ts-ignore
                this.kingdomMap = data.superkingdom.childData;
                console.log('k' + this.kingdomMap.length);
                this.kingdomMap.filter((i: any) => {
                    this.kingdompieChartLabels.push(i.key);
                    this.kingdompieChartData.push(i.doc_count);

                });
            });

    }
}


