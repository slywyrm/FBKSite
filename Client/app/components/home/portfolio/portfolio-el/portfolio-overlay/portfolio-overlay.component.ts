import { Component, Injector, Inject, ViewChild, OnInit, AfterViewInit, ElementRef, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { PortfolioEl } from './../../../../../shared/general.service';
import { OverlayService } from './../../../../../shared/overlay.service';
import { ORIGIN_URL } from './../../../../../shared/constants/baseurl.constants';
import { List } from 'linqts';
import * as $ from "jquery";

@Component({
    selector: 'portfolio-overlay',
    templateUrl: 'portfolio-overlay.component.html',
})
export class PortfolioOverlayComponent implements OnInit, AfterViewInit {
    private element: PortfolioEl;
    private lazyLoad: boolean = false;
    private scroll: number = -1;
    private scrolling: boolean = false;
    @ViewChild('main') private main: any;

    touchY: number;

    get mainElement(): Element {
        return this.main.nativeElement && this.main.nativeElement;
    }

    get isMobilePortrait(): boolean {
        return navigator && 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
               window.innerWidth < window.innerHeight;
    }

    constructor(private injector: Injector,
                private overlayService: OverlayService,
                public DOMElement: ElementRef,
                @Inject(PLATFORM_ID) public platform,
                @Inject(ORIGIN_URL) private baseurl) {
        this.element = injector.get('element');
        this.overlayService.lazyLoad$.subscribe(lazy => {
            this.lazyLoad = lazy;
        });
    }

    ngOnInit() {
        setTimeout(() => {
            this.resize();
            if (window) {
                $(window).resize(() => this.resize());
                if (this.element.stills.length == 0) {
                    $('.portfolio-el-overlay .down').css('height', 0);
                }
            }
        }, 10);
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platform)) {
            $(this.DOMElement.nativeElement).on("touchstart", e => this.onTouchStart(e.originalEvent as TouchEvent));
            $(this.DOMElement.nativeElement).on("touchmove", e => this.onTouchMove(e.originalEvent as TouchEvent));
            $(this.DOMElement.nativeElement).on("touchend", e => this.onTouchEnd(e.originalEvent as TouchEvent));
        }
    }

    onTouchStart(event: TouchEvent) {
        this.touchY = event.touches[0].pageY;
    }

    onTouchMove(event: TouchEvent) {
        event.cancelBubble = true;
        let delta = this.touchY - event.changedTouches[0].pageY;
        if (!this.scrolling && (delta < 20 || delta > -20))
            $(this.DOMElement).scrollTop($(this.DOMElement).scrollTop() + delta);
    }

    onTouchEnd(event: TouchEvent) {
        let delta = this.touchY - event.changedTouches[0].pageY;
        if (!this.scrolling && (delta > 20 || delta < -20)) {
            let scroll = 1;
            if (this.scroll > -1)
                scroll = Math.floor($(this.mainElement).height() / $(`#still${this.scroll}`).height());
            this.scrollTo(delta > 0 ? scroll : -scroll);
        }
    }

    private resize() {
        if(this.mainElement)
        {
            let height = $(this.mainElement).innerWidth();
            height = height / this.element.stillAspectRatio;
            height = Math.max(height,  $('#portfolio-el-descr').height());
            $(this.mainElement).height(height);
            $('.portfolio-el-overlay .wrapper').height(height);
            $('.stills').css({ minHeight: height });
            $('.portfolio-el-overlay').animate({ opacity: 1 }, 500);
            //$('.portfolio-el-overlay .main').css({ scrollTop: 0 });
        }
    }

    private date(date: string): string {
        let dDate = new Date(date + 'Z');
        let options = { "year":"numeric", "month":"long" };
        return Intl.DateTimeFormat("en-US", options).format(dDate);
    }

    private get orderedStills(): Array<string> {
        let list = new List<any>(this.element.stills);
        return list.OrderBy(item => item.order).Select(item => item.image).ToArray();
    }

    private scrollTo(change: number): void {
        setTimeout(() => this.scrolling = false, 502);
        //if (this.scroll + change == -2 || this.scroll + change == this.element.stills.length)
        //    return;
        //let last = this.scroll == this.element.stills.length - 1;

        this.scroll += change;
        this.scroll = Math.min(this.scroll, this.element.stills.length - 1);
        this.scroll = Math.max(this.scroll, -1);

        if (this.scroll == -1 && change < 0)
            $('.portfolio-el-overlay .up').stop().animate({ height: 0 }, 300);
        else if (this.scroll == 0 && change > 0)
            $('.portfolio-el-overlay .up').stop().animate({ height: "1vw" }, 300);

        let shownNum = Math.floor($(this.mainElement).height() / $(`#still0`).height());
        shownNum = Math.max(1, shownNum)

        if (this.scroll + shownNum > this.element.stills.length - 1 && change > 0)
            $('.portfolio-el-overlay .down').stop().animate({ height: 0 }, 300);
        else if (this.scroll + shownNum <= this.element.stills.length - 1 && change < 0 &&
                 $('.portfolio-el-overlay .down').height() == 0)
            $('.portfolio-el-overlay .down').stop().animate({ height: "1vw" }, 300);
        let overlay = $('.portfolio-el-overlay .main');
        let scrollTo = $(this.scroll > -1 ? `#still${this.scroll}` : '.portfolio-el-overlay .wrapper').offset().top - $('.portfolio-el-overlay .wrapper').offset().top;
        overlay.stop().animate({ scrollTop: scrollTo }, 500, 'swing');
    }

    @HostListener('wheel', ['$event'])
    onMouseWheel(event: WheelEvent) {
        let delta = event.deltaY;
        if (!this.scrolling) {
            this.scrolling = true;
            let scroll = 1;
            if (this.scroll > -1)
                scroll = Math.floor($(this.mainElement).height() / $(`#still${this.scroll}`).height());
            scroll = Math.max(1, scroll);
            this.scrollTo(delta > 0 ? scroll : -scroll);
        }
        event.stopPropagation();
    }

    /*@HostListener('DOMMouseScroll', ['$event.detail']) mozOnMouseWheel(delta: number) {
        return this.onMouseWheel(60 * delta);
    }*/

    /*@HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode == 38) {
            this.scrolling = true;
            this.scrollTo(-1);
        }
        else if (event.keyCode == 40) {
            this.scrolling = true;
            this.scrollTo(1);
        }
        event.stopPropagation();
    }*/
}