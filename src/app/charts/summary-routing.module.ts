import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TrackingStatusChartComponent} from './summary/tracking-status/tracking-status-chart.component';
import {EnaFirstPublicComponent} from './summary/ena-first-public/ena-first-public.component';
import {KingdomComponent} from './summary/kingdom/kingdom.component';
import {LifestageComponent} from './summary/lifestage/lifestage.component';
import {OrganismsPartComponent} from './summary/organisms-part/organisms-part.component';
import {SexDistributionComponent} from './summary/sex-distribution/sex-distribution.component';
import {OrganismsGeoLocationComponent} from './summary/organisms-geo-location/organisms-geo-location.component';
import {SummaryComponent} from './summary/summary.component';

const routes: Routes = [
    { path: '', component: SummaryComponent },
    { path: 'tracking-status', component: TrackingStatusChartComponent },
    { path: 'ena-first-public', component: EnaFirstPublicComponent },
    { path: 'kingdom', component: KingdomComponent },
    { path: 'lifestage', component: LifestageComponent },
    { path: 'organisms-part', component: OrganismsPartComponent },
    { path: 'sex-distribution', component: SexDistributionComponent },
    { path: 'organisms-geo-location', component: OrganismsGeoLocationComponent },

    ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SummaryRoutingModule { }
