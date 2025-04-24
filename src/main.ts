import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.module';
import {AppComponent} from './app/app.component';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';
import { cookieConfig } from './app/app.component';
import {importProvidersFrom} from '@angular/core';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(NgcCookieConsentModule.forRoot(cookieConfig)),
        ...appConfig.providers
    ]
}).catch(err => console.error(err));
