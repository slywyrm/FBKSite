import { Directive, ElementRef, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';

@Directive({
    selector: '[centerElement]'
})
export class CenterElementDirective implements OnInit {
    @Input() includeFooter: boolean = false;
    @Input() centerOnResize: boolean = false;
    @Input() animateOnResize: boolean = false;
    @Input() animateTime: number = 500;
    @Input() vProportion: number = 0.5;

    constructor(private element: ElementRef,
                @Inject(PLATFORM_ID) public platform: Object) {}

    private get $element() {
        if (this.element.nativeElement)
            return $(this.element.nativeElement);
        return null;
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platform))
            this.$element.ready(() => {
                this.centerElement();
                $(window).resize(() => this.centerElement());
                $(window).on("orientationchange", () => this.centerElement());
                if (this.centerOnResize)
                    this.$element.resize(() => this.centerElement(0, this.animateOnResize, this.animateTime));
            });
    }

    centerElement(height?: number, animate: boolean = false, animationTime: number = 0) {
        if (isPlatformBrowser(this.platform)) {
            let wHeight = $(window).height();
            let padding = Math.max($(window).height() - (height? height : this.$element.height()), 0)/* - $('header').height() * 2*/;
            let paddingTop = Math.max(padding * this.vProportion, $('header').height());
            let paddingBottom = Math.max(padding * (1-this.vProportion) - (this.includeFooter ? $('footer').height() * 2 : 0), 0);
            if (animate)
                this.$element.animate({ paddingTop: paddingTop, paddingBottom }, animationTime);
            else
                this.$element.css({ paddingTop: paddingTop, paddingBottom: paddingBottom });
            /*if (this.includeFooter) {
                let height = this.$element.height();
                this.$element.height(height);
            }*/
        }
    }
}