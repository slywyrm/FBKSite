import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { LocalStorageModule } from 'angular-2-local-storage';

import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

import { AppComponent } from './components/app/app.component';
import { AppRoutingModule } from './routes.module';

import { HomeComponent, SectionDirective } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { FBKNavComponent } from './components/home/nav/fbknav/fbknav.component';
import { OffcanvasNavComponent } from './components/home/nav/offcanvas-nav/offcanvas-nav.component'
import { OverlayComponent } from './components/home/overlay/overlay.component';
import { ReelComponent } from './components/home/reel/reel.component'
import { PortfolioComponent, PortfolioLineDirective } from './components/home/portfolio/portfolio.component';
import { PortfolioElComponent } from './components/home/portfolio/portfolio-el/portfolio-el.component';
import { PortfolioOverlayComponent } from './components/home/portfolio/portfolio-el/portfolio-overlay/portfolio-overlay.component';
//import { ContactSentComponent } from './components/home/contacts/contact-sent/contact-sent.component';
import { SafePipe, YoutubeComponent } from './components/lib/youtube/youtube.component';
import { DynamicComponent } from './components/lib/dynamic.component';
import { CompanyComponent } from './components/home/company/company.component';
import { ServiceComponent } from './components/home/services/service/service.component';
import { ServicesComponent } from './components/home/services/services.component';
//import { ContactsComponent } from './components/home/contacts/contacts.component';
import { LoginComponent } from './components/admin/login/login.component';
import { ContactsOverlayComponent } from './components/home/contacts-overlay/contacts-overlay.component';

import { ReelAdminComponent } from './components/admin/reel/reel-admin.component';
import { PortfolioAdminComponent } from './components/admin/portfolio/portfolio-admin.component';
import { PortfolioElAdminComponent } from './components/admin/portfolio/portfolio-el/portfolio-el-admin.component';
import { MediaInputComponent } from './components/admin/media-input/media-input.component';
import { StatusComponent } from './components/admin/status/status.component';
import { ServicesAdminComponent } from './components/admin/services/services-admin.component';
import { CompanyAdminComponent } from './components/admin/company/company-admin.component';
import { ContactsAdminComponent } from './components/admin/contacts/contacts-admin.component';

import { GeneralService } from './shared/general.service';
import { OverlayService } from './shared/overlay.service';
import { AdminService } from './shared/admin.service';
import { AuthGuard } from './shared/auth-guard.service';
import { MarginBottomDirective } from './shared/margin-bottom.directive';
//import { CenterElementDirective } from './shared/center-element.directive';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        HomeComponent,
        AdminComponent,
        FBKNavComponent,
        OffcanvasNavComponent,
        OverlayComponent,
        ReelComponent,
        PortfolioComponent,
        PortfolioLineDirective,
        PortfolioElComponent,
        PortfolioOverlayComponent,
        YoutubeComponent,
        SafePipe,
        DynamicComponent,
        CompanyComponent,
        ServiceComponent,
        ServicesComponent,
        //ContactsComponent,
        //ContactSentComponent,
        ContactsOverlayComponent,
        MarginBottomDirective,
        //CenterElementDirective,
        SectionDirective,
        
        LoginComponent,
        ReelAdminComponent,
        PortfolioAdminComponent,
        PortfolioElAdminComponent,
        MediaInputComponent,
        StatusComponent,
        ServicesAdminComponent,
        CompanyAdminComponent,
        ContactsAdminComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        TransferHttpModule,
        FormsModule,
        CustomFormsModule,
        AppRoutingModule,
        
        LocalStorageModule.withConfig({
            prefix: 'FBKSite',
            storageType: 'localStorage'
        }),
    ],
    providers: [GeneralService, AdminService, AuthGuard, OverlayService]
})
export class AppModule {}
