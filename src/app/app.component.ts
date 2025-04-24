import { Component, OnInit } from '@angular/core';
import { NgcCookieConsentConfig, NgcCookieConsentService} from 'ngx-cookieconsent';
import { HeaderComponent } from './shared/header/header.component';
import {Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';

export const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'portal.darwintreeoflife.org'
  },
  position: 'bottom',
  theme: 'classic',
  palette: {
    popup: {
      background: '#333',
      text: '#ffffff',
      link: '#ffffff'
    },
    button: {
      background: '#f1d600',
      text: '#333',
      border: 'transparent'
    }
  },
  type: 'info',
  elements: {
    messagelink: `
    <span id="cookieconsent:desc" class="cc-message">{{message}}
      <a aria-label="learn more about our privacy notice" tabindex="0" class="cc-link" href="{{privacyNoticeHref}}" target="_blank" rel="noopener">{{privacyNoticeLink}}</a> and
      <a aria-label="learn more about our terms of use" tabindex="1" class="cc-link" href="{{touHref}}" target="_blank" rel="noopener">{{touLink}}</a>
    </span>
    `,
  },
  content: {
    message: 'This website requires cookies, and the limited processing of your personal data in order to function. ' +
        'By using the site you are agreeing to this as outlined in our ',

    privacyNoticeLink: 'Privacy Notice',
    privacyNoticeHref: '/assets/gdpr/dtol_gdpr.pdf',

    touLink: 'Terms of Use',
    touHref: '/assets/gdpr/terms_of_use.pdf',

    dismiss: 'Accept cookies',
    deny: 'Refuse cookies',
    policy: 'Cookie Policy'
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'tree-of-life-portal';
  isHomeRoute: boolean = false;

  constructor(private router: Router,
              private ccService: NgcCookieConsentService) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.isHomeRoute = this.router.url === '/home';
    });
  }

}
