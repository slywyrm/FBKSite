import { Component, AfterViewInit, Input, Output, EventEmitter, ViewChild, HostListener, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ORIGIN_URL } from './../../../../shared/constants/baseurl.constants';
import { Service } from './../../../../shared/general.service';
import * as $ from 'jquery';

@Component({
    selector: 'service',
    templateUrl: 'service.component.html'
})
export class ServiceComponent implements AfterViewInit {
    @Input() service: Service;
    @Output() clicked = new EventEmitter<Service>();
    @ViewChild('image') private image;
    @ViewChild('button') private button;

    private get $image() {
        return $(this.image.nativeElement);
    }

    private get $button() {
        return $(this.button.nativeElement);
    }

    private get imageLink() {
        return `${this.baseUrl}/${this.service.iconStaticURL}`;
    }

    constructor(public element: ElementRef,
                @Inject(ORIGIN_URL) private baseUrl: string,
                @Inject(PLATFORM_ID) public platform: Object) {}

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platform))
            $(window).resize(() => this.resizeButton());
    }

    resizeButton(): void {
        let height = Math.floor(this.$image.height());
        this.$button.height(height);
        /*$(window).resize(() => {
            this.$button.css({ height: 'auto'});
            setTimeout(() => this.$button.height(Math.floor(this.$image.height())));
        });*/
    }

    @HostListener('click') onClick(): void {
        this.clicked.emit(this.service);
    }

    @HostListener('mouseover') onMouseOver(): void {
        if (this.image.nativeElement) {
            //let src = this.$image.attr('src').replace('_static.png', '.gif');
            this.$image.attr('src', this.service.iconURL);
        }
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        if (this.image.nativeElement) {
            //let src = this.$image.attr('src').replace('.gif', '_static.png');
            this.$image.attr('src', this.service.iconStaticURL);
        }
    }
}

