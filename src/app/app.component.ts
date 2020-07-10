import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-skeleton';
  @ViewChild('cookieLaw')
  cookieLawEl: any;

  ngOnInit() {
  }

  dismiss(): void {
    this.cookieLawEl.dismiss();
  }
}
