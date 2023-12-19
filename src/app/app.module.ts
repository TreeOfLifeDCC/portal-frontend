import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgcCookieConsentModule } from 'ngx-cookieconsent';
import { cookieConfig } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableExporterModule } from 'mat-table-exporter';
import { BytesPipe } from './shared/bytes-pipe';
import { HeaderComponent } from './shared/header/header.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { ApiComponent } from './api/api.component';
import {DownloadConfirmationDialogComponent} from './download-confirmation-dialog-component/download-confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {ConfirmationDialogComponent} from './confirmation-dialog-component/confirmation-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { GisComponent } from './gis/gis.component';
import { GisService } from './gis/gis.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {DashboardModule} from './dashboard/dashboard.module';
import {MatInputModule} from '@angular/material/input';
import {FilterService} from './services/filter-service';
import { BulkDownloadsComponent } from './bulk-downloads/bulk-downloads.component';
import {PublicationsComponent} from './publications/publications.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {GetDataService} from './services/get-data.service';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    HelpComponent,
    HomeComponent,
    ApiComponent,
    DownloadConfirmationDialogComponent,
    BytesPipe,
    ConfirmationDialogComponent,
    GisComponent,
    BulkDownloadsComponent,
    PublicationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatTableExporterModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTooltipModule,
    ClipboardModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    DashboardModule,
    MatInputModule,
    NgxSpinnerModule,
    MatExpansionModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
  ],
  providers: [BytesPipe, GisService, FilterService, GetDataService],
  bootstrap: [AppComponent],

})
export class AppModule { }

