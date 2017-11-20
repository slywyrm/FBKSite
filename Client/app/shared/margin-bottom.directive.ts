import { Directive, ElementRef, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';

@Directive({
    selector: '[marginBottom]'
})
export class MarginBottomDirective implements OnInit {
    @Input() includeFooter: boolean = false;
    @Input() includeHeader: boolean = false;

    constructor(private element: ElementRef,
                @Inject(PLATFORM_ID) public platform) {}

    private get $element() {
        if (this.element.nativeElement)
            return $(this.element.nativeElement);
        return null;
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platform)) {            
            setTimeout(() => {
                this.changeMarginBottom();
                this.$element.resize(() => this.changeMarginBottom());
            }, 100);
        }
    }

    private changeMarginBottom() {
        if (isPlatformBrowser(this.platform)) {
            let margin = $(window).height() - this.$element.height()/* - $('header').height() * 2*/;
            margin -= this.includeFooter ? $('footer').height() : 0;
            margin -= this.includeHeader ? $('header').height() : 0;
            margin = Math.max(0, margin);
            this.$element.css({ marginBottom : margin });
            if (this.includeHeader)
                this.$element.css({ marginTop: $('header').height() });
            /*let height = this.$element.height();
            this.$element.height(height);*/
        }
    }
}