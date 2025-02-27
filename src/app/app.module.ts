import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';


import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import { routes } from './routing.module';


export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideAnimations(), provideHttpClient()]
};
