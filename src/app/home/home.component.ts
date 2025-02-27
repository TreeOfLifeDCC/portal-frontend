import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NavigationEnd, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    RouterLink,
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private twitter: any;

  constructor(private titleService: Title, private router: Router) {
    this.initTwitterWidget();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Home');
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

}
