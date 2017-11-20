import { Component, OnInit, AfterViewInit, Inject, HostListener, ViewChild, SimpleChanges, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { GeneralService } from './../../../shared/general.service';
import * as $ from 'jquery';

@Component({
    selector: 'reel',
    templateUrl: './reel.component.html',
    providers: [GeneralService]
})
export class ReelComponent implements OnInit, AfterViewInit {
    @ViewChild('video') video;
    reelUrl: string = "not_loaded"; 
    logoUrl: string = "not_loaded";
    isFullscreenInit: boolean = false;

    get webmUrl() {
        let url = this.reelUrl.split('.')[0] + '.webm';
        return url;
    }

    constructor(private generalService: GeneralService,
                @Inject(PLATFORM_ID) public platform) {}

    ngOnInit(): void {
        this.getSettings();
        setTimeout(() => this.video.nativeElement.muted = true, 100);
        
    }

    ngAfterViewInit(): void {
        /*if (this.video && this.video.nativeElement) {
            let video = this.video.nativeElement as HTMLVideoElement;
            video.onloadedmetadata = () => {
                this.div.centerElement();
                this.generalService.siteLoading.next(false);
            }
        }*/
        if (isPlatformBrowser(this.platform)) {
            let height = $(window).width() * 817 / 1920; 
            //this.div.centerElement(height);
            this.generalService.siteLoading.next(false);
        }
    }

    getSettings(): void {
        this.generalService.getSetting('reel', "videoURL")
            .subscribe(reelUrl => {
                this.reelUrl = reelUrl && reelUrl.value; 
            });
        this.generalService.getSetting('reel', "logoURL")
            .subscribe(logoUrl => this.logoUrl = logoUrl && logoUrl.value);
    }

    onMouseEnter(): void {
        this.initFullscreen();
        if (this.video && this.video.nativeElement) {
            let video = this.video.nativeElement;
            video.play();
        }
    }

    onMouseLeave(): void {
        this.initFullscreen();
        if (this.video && this.video.nativeElement) {
        let video = this.video.nativeElement;
            video.pause();
            let document: any = window.document;
            let fullscreen = document.fullscreenElement ||
                document.msFullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement;
            if (!fullscreen) {
                video.pause();
            }
        }
    }

    onClick(): void {
        this.initFullscreen();
        if (this.video && this.video.nativeElement) {
            let video = this.video.nativeElement;
            if (video.requestFullscreen) {
                video.requestFullScreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullScreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        }
    }

    onFullscreenChange(): void {
        let document: any = window.document;
        let fullscreen = document.fullscreenElement ||
            document.msFullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement;
        let video = $('#reel-video')[0] as HTMLVideoElement;
        if ($(fullscreen).parent().hasClass('reel-wrapper')) {
            video.muted = false;
            $('.reel-wrapper').css('cursor', 'default');
            video.controls = true;
        } 
        else {
            $('.reel-wrapper').css('cursor', 'pointer');
            video.muted = true;
            video.controls = false;  
        }
    }

    initFullscreen(): void {
        let document: any = window.document;
        if (this.isFullscreenInit) 
            return;
        if (document.onfullscreenchange === null)
            document.onfullscreenchange = this.onFullscreenChange;
        else if (document.onwebkitfullscreenchange === null)
            document.onwebkitfullscreenchange = this.onFullscreenChange;
        else if (document.onmozfullscreenchange == null)
            document.onmozfullscreenchange = this.onFullscreenChange;
        else if (document.onmsfullscreenchange == null)
            document.onmsfullscreenchange = this.onFullscreenChange;
    }
}