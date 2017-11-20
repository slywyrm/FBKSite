import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

import { AdminService } from './../../../../shared/admin.service';
import { OverlayService } from './../../../../shared/overlay.service';
import { ContactsOverlayComponent } from './../../contacts-overlay/contacts-overlay.component';
import { HomeComponent } from './../../home.component';
import { AdminComponent } from './../../../admin/admin.component';

@Component({
    selector: 'fbknav',
    templateUrl: './fbknav.component.html'
})
export class FBKNavComponent implements AfterViewInit {
    offcanvasEnabled: boolean = false;
    @ViewChild('navList') navList: ElementRef;
    @ViewChild('offcanvasEl') offcanvasEl: ElementRef;

    logoLink = '/media/logo_small.png';

    constructor(private adminService: AdminService,
                private route: ActivatedRoute,
                private overlayService: OverlayService,
                @Inject(PLATFORM_ID) public platform) {}

    get offcanvas$() {
        return $('#offcanvas-nav');
    }

    get component() {
        if (this.route.firstChild.snapshot.url[0].path == 'home')
            return 'HomeComponent';
        else if (this.route.firstChild.snapshot.url[0].path == 'admin')
            return 'AdminComponent';
    }

    ngAfterViewInit(): void {
    }

    private get routeActive(): boolean {
        if (this.route.firstChild)
            return true;
        return false;
    }

    private contactsClicked(): void {
        let data = { component: ContactsOverlayComponent, inputs: [] };
        this.overlayService.callOverlay(data);
    }

    offcanvasToggled(event?: MouseEvent): boolean {
        if (this.offcanvasEnabled) {
            this.offcanvas$.css({ transform: 'translateX(100%)'});
            setTimeout(() => {
                this.offcanvasEnabled = false;
                this.offcanvas$.css({ display: 'none'});
            }, 500);
        }
        else {
            this.offcanvasEnabled = true;
            this.offcanvas$.css({ display: 'block' });
            setTimeout(() => this.offcanvas$.css({ transform: 'translateX(0)'}));
        }
        if (event)
            event.stopPropagation();
        return false;
    }
}