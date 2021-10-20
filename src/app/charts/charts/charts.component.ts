// import {Component, OnInit} from '@angular/core';
// import {ActivatedRoute} from '@angular/router';
// import {HttpClient} from '@angular/common/http';
// import {ChartOptions, ChartType, SingleDataSet} from '@rinminase/ng-charts';
// import * as d3 from 'd3';
// import * as t from 'topojson';
// import {ChartDataSets} from 'chart.js';
//
//
// @Component({
//     selector: 'app-charts',
//     templateUrl: './charts.component.html',
//     styleUrls: ['./charts.component.css']
// })
// export class ChartsComponent implements OnInit {
//     private z: any;
//
//     constructor(private http: HttpClient, route: ActivatedRoute) {
//     }
//
//     private svg;
//     private margin = 50;
//     private width = 750;
//     private height = 600;
//     // private API_BASE_URL = 'http://localhost:8080';
//     private API_BASE_URL = 'http://45.86.170.227:30985';
//     // private API_BASE_URL = 'https://portal.darwintreeoflife.org/api';
//     // The radius of the pie chart is half the smallest side
//     labelsTrackingStatuses = [];
//     dataTrackingStatuses = [];
//     filtersMap: any;
//
//     public habitatPieChartLabels = [];
//     public habitatPieChartData = [];
//     public organismPartPieChartLabels = [];
//     organismPartPieChartData = [];
//     lifestagePieChartLabels = [];
//     lifestagePieChartData = [];
//     public kingdompieChartLabels = [];
//     public kingdompieChartData = [];
//     firstPubliclineChartLabels = [];
//     firstPubliclineChartData = [];
//     public lineChartData: ChartDataSets[] = [];
//     public name = 'd3';
//     public pieChartOptions: ChartOptions = {
//         responsive: true,
//     };
//     tooltipDiv: any;
//     public pieChartLabels = [];
//     public pieChartType: ChartType = 'pie';
//     public lineChartType: ChartType = 'line';
//     public pieChartLegend = true;
//     public pieChartPlugins = [];
//
//     public pieChartData: SingleDataSet = [];
//     chartColors = [{
//         backgroundColor: [
//             'rgb(253,200,139)',
//             'rgb(241,109,97)',
//             '#7cae85',
//             '#94ccc2',
//             '#e3a3ad',
//             '#4BBEFD',
//             '#3f308f',
//             '#d27484',
//             '#dc556c'
//         ],
//         borderWidth: 1,
//         borderColor: 'white',
//         hoverBorderWidth: 2,
//         hoverBorderColor: 'grey',
//         options: {
//             title: {
//                 display: true,
//                 text: 'Pie Chart',
//                 fontSize: 25
//             },
//             legend: {
//                 display: true,
//                 position: 'right',
//                 labels: {
//                     fontColor: '#000'
//                 }
//             },
//             layout: {
//                 padding: {
//                     left: 50,
//                     right: 0,
//                     bottom: 0,
//                     top: 0
//                 }
//             },
//             tooltips: {
//                 enabled: true
//             }
//         }
//     }];
//     lifestageChartColors = [{
//         backgroundColor: [
//             'rgb(112,30,127)',
//             'rgb(241,109,97)',
//             '#e3a3ad',
//             '#94ccc2',
//             '#e3a3ad',
//             '#4BBEFD',
//             '#3f308f',
//             '#d27484',
//             '#dc556c'
//         ],
//         borderWidth: 1,
//         borderColor: 'white',
//         hoverBorderWidth: 2,
//         hoverBorderColor: 'grey',
//         options: {
//             title: {
//                 display: true,
//                 text: 'Pie Chart',
//                 fontSize: 25
//             },
//             legend: {
//                 display: true,
//                 position: 'right',
//                 labels: {
//                     fontColor: '#000'
//                 }
//             },
//             layout: {
//                 padding: {
//                     left: 50,
//                     right: 0,
//                     bottom: 0,
//                     top: 0
//                 }
//             },
//             tooltips: {
//                 enabled: true
//             }
//         }
//     }];
//     sexchartColors = [{
//         backgroundColor: [
//             'rgb(248,126,97)',
//             'rgb(253,164,115)',
//             '#4BBEFD',
//             '#3f308f',
//             '#d27484',
//             '#dc556c',
//             '#7cae85',
//             '#857bb8',
//             '#e3a3ad'
//         ],
//         borderWidth: 1,
//         borderColor: 'white',
//         hoverBorderWidth: 2,
//         hoverBorderColor: 'grey',
//         options: {
//             title: {
//                 display: true,
//                 text: 'Pie Chart',
//                 fontSize: 25
//             },
//             legend: {
//                 display: true,
//                 position: 'right',
//                 labels: {
//                     fontColor: '#000'
//                 }
//             },
//             layout: {
//                 padding: {
//                     left: 50,
//                     right: 0,
//                     bottom: 0,
//                     top: 0
//                 }
//             },
//             tooltips: {
//                 enabled: true
//             }
//         }
//     }];
//
//     organismChartColors = [{
//         backgroundColor: [
//             'rgb(219,75,104)',
//             '#857bb8',
//             '#e3a3ad',
//             '#94ccc2',
//             '#e3a3ad',
//             '#4BBEFD',
//             '#3f308f',
//             '#d27484',
//             '#dc556c'
//         ],
//         borderWidth: 1,
//         borderColor: 'white',
//         hoverBorderWidth: 2,
//         hoverBorderColor: 'grey',
//         options: {
//             title: {
//                 display: true,
//                 text: 'Habitat Pie Chart',
//                 fontSize: 25
//             },
//             legend: {
//                 display: true,
//                 position: 'right',
//                 labels: {
//                     fontColor: '#000'
//                 }
//             },
//             layout: {
//                 padding: {
//                     left: 50,
//                     right: 0,
//                     bottom: 0,
//                     top: 0
//                 }
//             },
//             tooltips: {
//                 enabled: true
//             }
//         }
//     }];
//     kingdomChartColors = [{
//         backgroundColor: [
//             'rgb(188,58,118)',
//             '#857bb8',
//             '#e3a3ad',
//             '#94ccc2',
//             '#e3a3ad',
//             '#4BBEFD',
//             '#3f308f',
//             '#d27484',
//             '#dc556c'
//         ],
//         borderWidth: 1,
//         borderColor: 'white',
//         hoverBorderWidth: 2,
//         hoverBorderColor: 'grey',
//         options: {
//             title: {
//                 display: true,
//                 text: 'Habitat Pie Chart',
//                 fontSize: 25
//             },
//             legend: {
//                 display: true,
//                 position: 'right',
//                 labels: {
//                     fontColor: '#000'
//                 }
//             },
//             layout: {
//                 padding: {
//                     left: 50,
//                     right: 0,
//                     bottom: 0,
//                     top: 0
//                 }
//             },
//             tooltips: {
//                 enabled: true
//             }
//         }
//     }];
//     lineChartOptions = {
//         responsive: true,
//         fill: {
//             target: 'origin',
//             above: 'rgb(255, 0, 0)',   // Area will be red above the origin
//             below: 'rgb(0, 0, 255)'    // And blue below the origin
//         }
//     };
//
//
//     lineChartLegend = {
//         title: {
//             display: true,
//             text: 'Habitat Pie Chart',
//             fontSize: 25
//         },
//     };
//
//     // tslint:disable-next-line:typedef
//     public camelize(text) {
//         text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
//         return text.substr(0, 1).toLowerCase() + text.substr(1);
//     }
//
//
//     ngOnInit(): void {
//         const width = 800;
//         const height = 960;
//         // tslint:disable-next-line:no-unused-expression
//
//
//         const dataList = [];
//         const colors = ['rgb(112,75,144)', 'rgb(140,75,152)', 'rgb(90,51,127)', 'rgb(150,81,155)', 'rgb(161,75,147)'];
//
//         const projection = d3.geoMercator().center([2, 55.4])
//             .rotate([3.0, 0])
//             .scale(2000)
//             .translate([width / 2, height / 2]);
//
//         const svg = d3.select('div#container').append('svg')
//             .attr('preserveAspectRatio', 'none')
//             .attr('viewBox', '0 0 ' + 800 + ' ' + height)
//             .attr('height', height);
//         const path = d3.geoPath()
//             .projection(projection);
//         const g = svg.append('g');
//         g.attr('class', 'map');
//         const zoom = d3.zoom()
//             .scaleExtent([1 / 2, 8])
//             // .on("zoom", this.zoomed));
//             .on('zoom', (d) => {
//                 return g.attr('transform', d3.event.transform);
//             });
//         svg.call(zoom
//         );
//         d3.select('#zoom_in').on('click', () => {
//             // Smooth zooming
//             zoom.scaleBy(svg.transition().duration(750), 1.3);
//         });
//
//         d3.select('#zoom_out').on('click', () => {
//             // Ordinal zooming
//             zoom.scaleBy(svg, 1 / 1.3);
//         });
//
//         // Tooltip
//         this.tooltipDiv = d3.select('body')
//             .append('div')
//             .attr('class', 'map-tooltip')
//             .style('opacity', 0);
//
//         console.log('outside json calling1');
//         d3.json('../../assets/test-uk-countries.json')
//             // d3.json("https://raw.githubusercontent.com/cszang/dendrobox/5199e47bf6c403a2e9f28bec3b764a2fe23ce359/data/maps.json")
//
//             // tslint:disable-next-line:only-arrow-functions typedef
//             .then(function(topology) {
//                 // <---- Renamed it from data to topology
//                 console.log('------>', topology.feature);
//                 g.selectAll('path')
//                     .data(t.feature(topology, topology.objects.GBR_adm2).features)
//                     // .data(t.feature(topology, topology.objects.countries)
//                     //  .geometries)
//                     .enter()
//                     .append('path')
//                     .attr('d', path).style('fill', () => colors[Math.floor(Math.random() * (4 - 1) + 1)])
//                     .append('svg:title').html((d) => '<strong>' + d.properties.NAME_2 + '</strong>');
//             });
//         this.http.get(this.API_BASE_URL + `/organisms/get-geo-locations`).subscribe(
//             data => {
//                 // @ts-ignore
//                 for (const item of data) {
//                     // @ts-ignore
//                     dataList.push(item);
//                 }
//                 g.selectAll('path')
//                     .data(dataList)
//                     .enter().append('path')
//                     .attr('d', path)
//                     .attr('class', 'data')
//                     // show tooltip
//                     .on('mouseover', (d) => {
//                         this.tooltipDiv.transition()
//                             .duration(200)
//                             .style('opacity', .9);
//                         this.tooltipDiv.html('<strong>' + d.id + '</strong>')
//                             .style('left', (d3.event.pageX) + 'px')
//                             .style('top', (d3.event.pageY - 28) + 'px');
//                     }).on('click', (d) => {
//                     window.open('/data/organism/details/' + d.id, '_blank');
//                 }).on('mouseout', (d) => {
//                     this.tooltipDiv.transition()
//                         .duration(500)
//                         .style('opacity', 0);
//                 });
//             });
//
//
//     }
//
//
// }
//
//
//
