import { Component, OnInit, AfterViewInit, Directive, ElementRef, ViewChildren, QueryList, Input, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { List } from 'linqts';
import * as $ from 'jquery';

import { GeneralService } from './../../shared/general.service';
import { OverlayService } from './../../shared/overlay.service';
import { isFirefox } from './../../shared/constants/browser.constants';
import { OnEventEnd } from './../../shared/on-event-end';

@Directive({
    selector:'[section]'
})
export class SectionDirective {
    constructor(public element: ElementRef) {}

    public get id(): string {
       //try {
            let element = this.element.nativeElement as HTMLElement;
            let id = element.firstElementChild.id;
            return id;
        /*}
        catch (err) {
            console.log(err);
            return null;
        }*/
    }
}



@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChildren(SectionDirective) sections: QueryList<SectionDirective>;
    selectedSection: SectionDirective;
    scrolling: boolean = false;
    touchY: number;
    scrollTop: number;

    get body() {
        if (isFirefox)
            return $('body,html');
        else if (navigator && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
            return $('body');
        return $('html body');        
    }

    constructor(public route: ActivatedRoute,
                public router: Router,
                public generalService: GeneralService,
                public overlayService: OverlayService,
                @Inject(PLATFORM_ID) public platform: Object) {}

    ngOnInit() {
        if (isPlatformBrowser(this.platform)) {
            setTimeout(() => {
                if (this.generalService.siteLoading.value)
                    this.generalService.siteLoading.next(false)
            }, 3000);
        }
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platform)) {
            this.route.params.subscribe(params => {        
                if (this.sections)
                {
                    let getSelectedSection = () => {
                        this.selectedSection = this.sections.find(section => {
                            if (section && section.id)
                                return section.id == params['section'];
                            else
                                return false;
                        });
                        this.scrollTo(params['section']);
                    }
                    try {
                        getSelectedSection();
                    }
                    catch (err) {
                        setTimeout(() => getSelectedSection(), 100);
                    }
                }
            });
            let scroll = () => {
                if (this.selectedSection && !this.scrolling)
                    this.scrollTo(this.selectedSection.id);
                else
                    setTimeout(() => scroll(), 200);
            };
            if (this.selectedSection)
                $(this.selectedSection.element).ready(() => {
                    scroll();
                    setTimeout(() => this.generalService.siteLoading.next(false), 100);
                });
            else
                $(document).ready(() => {
                    scroll();
                    setTimeout(() => this.generalService.siteLoading.next(false), 100);
                });
            setTimeout(() => { 
                if (this.generalService.siteLoading.value)
                    this.generalService.siteLoading.next(false);
            }, 500);
            //if (navigator && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            /*let event = new OnEventEnd();
            $(window).resize(() => event.event(() => { 
                $('.content-member').css('padding', `${$('header').outerHeight()} 0`);
                scroll(); 
            }));*/
                //document.documentElement.requestFullscreen();
            //}
            this.body.css('overflow', 'hidden');
            //$(window).on('orientationchange', () => scroll());
            $(document).bind('touchstart', e => this.onTouchStart(e.originalEvent));
            $(document).on('touchend touchcancel', e => this.onTouchEnd(e.originalEvent));
            $(document).bind('touchmove', e => this.onTouchMove(e.originalEvent));
            /*setTimeout(() => {
                $('.content-member').css('padding', `${$('header').outerHeight()} 0`);
            }, 300);*/
        }
    }

    @HostListener('wheel', ['$event.deltaY']) onMouseWheel(delta: number) {
        if (this.overlayService.overlayEnabled)
            return;
        if (isPlatformBrowser(this.platform))
        {
            delta = isFirefox? delta * 100 / 3 : delta;
            if (this.selectedSection && !this.scrolling)
            {
                let selectedElement = $(`#${this.selectedSection.id}`);
                let height = selectedElement.outerHeight();
                if (height > $(window).height()/* - $('header').height()*/)
                {
                    let scrollTop = this.body.scrollTop();
                    let scrollBottom = scrollTop + $(window).height()/* - $('header').height()*/;
                    
                    if ((scrollTop > Math.floor(selectedElement.offset().top) && delta < 0) ||
                        (scrollBottom < Math.ceil(selectedElement.offset().top + height) && delta > 0)) {
                            this.body.stop().animate({ scrollTop: scrollTop + delta }, 100);
                            return;
                        }   
                }
            }

            this.scrollByIndex(delta > 0 ? 1 : -1);            
        }
        return false;
    }

    /*@HostListener('DOMMouseScroll', ['$event.detail']) mozOnMouseWheel(delta: number) {
        return this.onMouseWheel(60 * delta);
    }*/

    @HostListener('document:keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        if (this.overlayService.overlayEnabled) {
            event.stopPropagation();
            return;
        }
        if (event.keyCode == 38)
            this.scrollByIndex(-1);
        else if (event.keyCode == 40)
            this.scrollByIndex(1);
    }

    //@HostListener('touchstart', ['$event'])
    onTouchStart(event: any): void
    {
        //alert('touchstart fired');
        //event.preventDefault();
        if (this.overlayService.overlayEnabled) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        this.touchY = event.changedTouches[0].pageY;
        this.scrollTop = this.body.scrollTop();
    }

    //@HostListener('touchend', ['$event'])
    onTouchEnd(event: any): void {
        if (this.overlayService.overlayEnabled) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        let delta = this.touchY - event.changedTouches[0].pageY;
        //alert('touchend fired');
        if (this.selectedSection && !this.scrolling)
        {
            let selectedElement = $(`#${this.selectedSection.id}`);
            let height = selectedElement.outerHeight();
            if (height > $(window).height()/* - $('header').height()*/)
            {
                let scrollTop = this.body.scrollTop();
                let scrollBottom = scrollTop + $(window).height()/* - $('header').height()*/;
                
                if ((scrollTop > Math.floor(selectedElement.offset().top) && delta < 0) ||
                    (scrollBottom < Math.ceil(selectedElement.offset().top + height) && delta > 0)) {
                        //this.body.stop().animate({ scrollTop: scrollTop + delta }, 100);
                        return;
                    } 
            }            
        }
        if (delta > 7 || delta < -7){
            event.stopPropagation();
            this.scrollByIndex(delta > 0 ? 1 : -1);            
        }
        else
            this.body.stop().animate({ scrollTop: this.scrollTop }, 200);
    }

    //@HostListener('touchmove', ['$event'])
    onTouchMove(event: any) {
        if (this.overlayService.overlayEnabled) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }

        let delta = this.touchY - event.changedTouches[0].pageY;
        
        if (this.selectedSection && !this.scrolling)
        {
            let selectedElement = $(`#${this.selectedSection.id}`);
            let height = selectedElement.outerHeight();
            if (height > $(window).height() - $('header').height())
            {
                let scrollTop = this.body.scrollTop();
                let scrollBottom = scrollTop + $(window).height() - $('header').height();
                
                if ((scrollTop <= Math.floor(selectedElement.offset().top) && delta < 0) ||
                    (scrollBottom >= Math.ceil(selectedElement.offset().top + height) && delta > 0)) {
                        if (event.preventDefault)
                            event.preventDefault();
                        return false;
                    }   
            }
        }
        //else
         //   this.body.scrollTop(this.scrollTop - delta);
    }

    scrollByIndex(delta: number) {
        if (!this.scrolling) {
            let i = this.sections.toArray().findIndex(section => section == this.selectedSection) + delta;
            if (i >= 0 && i < this.sections.toArray().length) {
                this.selectedSection = this.sections.toArray()[i];
                //this.scrollTo(this.selectedSection.id);
                this.router.navigate(['home', this.selectedSection.id]);
            }
        }
    }

    scrollTo(id: string): void {
        if (isPlatformBrowser(this.platform)) {
            let section = $(`#${id}`);
            if (section.offset())
            {
                this.scrolling = true;
                $('body,html').stop().animate({ scrollTop: section.offset().top }, 1000);
                setTimeout(() => this.scrolling = false, 1001);
            }
        }
    }
}
