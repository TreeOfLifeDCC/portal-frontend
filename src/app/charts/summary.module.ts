import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SummaryRoutingModule} from './summary-routing.module';
import {ChartsModule} from '@rinminase/ng-charts';
import {SummaryComponent} from './summary/summary.component';
import {MatTabsModule} from '@angular/material/tabs';
import {TrackingStatusChartComponent} from './summary/tracking-status/tracking-status-chart.component';
import {EnaFirstPublicComponent} from './summary/ena-first-public/ena-first-public.component';
import {HabitatComponent} from './summary/Habitat/habitat.component';
import {KingdomComponent} from './summary/kingdom/kingdom.component';
import {LifestageComponent} from './summary/lifestage/lifestage.component';
import {OrganismsPartComponent} from './summary/organisms-part/organisms-part.component';
import {SexDistributionComponent} from './summary/sex-distribution/sex-distribution.component';
import {OrganismsGeoLocationComponent} from './summary/organisms-geo-location/organisms-geo-location.component';


@NgModule({
    declarations: [ SummaryComponent, TrackingStatusChartComponent, EnaFirstPublicComponent,
        HabitatComponent, KingdomComponent,
        LifestageComponent, OrganismsPartComponent , SexDistributionComponent, OrganismsGeoLocationComponent ],
    imports: [
        SummaryRoutingModule,
        CommonModule,
        ChartsModule,
        MatTabsModule,
    ],
    providers: []
})
export class SummaryModule {
}
