import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';

import { GeneralService } from './../../shared/general.service';
import { isFirefox } from './../../shared/constants/browser.constants';

@Component ({
    selector: 'admin',
    templateUrl: 'admin.component.html'
})
export class AdminComponent implements AfterViewInit {
    constructor(public generalService: GeneralService,
                @Inject(PLATFORM_ID) public platform: any) {}

    get body(): JQuery {
        if (isPlatformBrowser(this.platform))
            return isFirefox? $('body,html') : $('html body');
        return null;
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platform)) {
            this.body.css('overflow', 'auto');
            $(window).on('load', () => this.generalService.siteLoading.next(false));
            setTimeout(() =>this.generalService.siteLoading.next(false), 1000);
        }
    }
}