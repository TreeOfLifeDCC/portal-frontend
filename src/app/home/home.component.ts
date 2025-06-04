import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {ApiService} from '../api.service';
import {MatChip} from '@angular/material/chips';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    MatChip
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private twitter: any;
  data: any;
  statusKeys: string[] = [];


  constructor(private titleService: Title, private router: Router, private apiService: ApiService) {
    this.initTwitterWidget();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Home');
    this.apiService.getSummaryData('summary', 'summary').subscribe(data => {
      this.data = data['results'][0]['_source'];
      this.statusKeys = Object.keys(this.data);
    });
  }

  // tslint:disable-next-line:typedef
  initTwitterWidget() {
    this.twitter = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        (<any>window).twttr = (function (d, s, id) {
          let js: any;
          const fjs = d.getElementsByTagName(s)[0],
              t = (<any>window).twttr || {};
          if (d.getElementById(id)) {
            return t;
          }
          js = d.createElement(s);
          js.id = id;
          js.src = 'https://platform.twitter.com/widgets.js';
          fjs.parentNode.insertBefore(js, fjs);

          t._e = [];
          t.ready = function (f: any) {
            t._e.push(f);
          };

          return t;
        }(document, 'script', 'twitter-wjs'));

        if ((<any>window).twttr.ready()) {
          (<any>window).twttr.widgets.load();
        }

      }
    });
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.twitter.unsubscribe();
  }

  getQueryParams(key: string) {
    const mapping: { [original: string]: string } = {
      'Genome Notes': 'Genome Notes - Submitted',
      'Annotation Complete': 'Annotation Complete - Done'
    };

    const updatedKey = mapping[key] || key;

    return { 0: updatedKey };
  }


}
