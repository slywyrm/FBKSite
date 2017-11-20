import { Component, ViewChild, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';

import { OverlayService } from './../../shared/overlay.service';
import { GeneralService } from './../../shared/general.service';
import { LoginComponent } from './../admin/login/login.component';
import { ORIGIN_URL } from './../../shared/constants/baseurl.constants';
import { FBKNavComponent } from './../home/nav/fbknav/fbknav.component';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    siteLoading: boolean = true;
    _siteLoadingSrc: string = 'media/loadingReel.gif';
    @ViewChild(FBKNavComponent) nav: FBKNavComponent;

    get siteLoadingSrc(): string {
        if (this._siteLoadingSrc)
            return `${this.baseUrl}/${this._siteLoadingSrc}`;
        return '';
    }

    constructor(private overlayService: OverlayService,
                private generalService: GeneralService,
                @Inject(PLATFORM_ID) public platform: Object,
                @Inject(ORIGIN_URL) public baseUrl: string) { }

    ngOnInit(): void {
        /*this.generalService.getSetting('general', 'siteLoadingGif')
                           .subscribe(src => this._siteLoadingSrc = src.value);*/
        this.generalService.siteLoading.subscribe(loading => {
            if (!loading && isPlatformBrowser(this.platform)) {
                let height = $('#site-loading').height();
                $('#site-loading').animate({ top: -height, bottom: height }, 500);
                setTimeout(() => this.siteLoading = false, 500);
            }
        });
    }

    @HostListener('document:keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): KeyboardEvent {        
        let code = event.code? event.code : event.keyCode;
        if ((code == 12 || code == 'KeyL') && event.ctrlKey && event.shiftKey)
        {
            let data = {
                component: LoginComponent,
                inputs: { }
            };
            this.overlayService.callOverlay(data);
        }
        return event;
    }

    @HostListener('click', ['$event.target'])
    onClick(target: HTMLElement): boolean {
        if (this.nav.offcanvasEnabled) {
            if (!(target.id == "offcanvas-nav" || target.parentElement.id == "offcanvas-nav")) {
                this.nav.offcanvasToggled();
                return false;
            }
        }
        return true;
    }
}
