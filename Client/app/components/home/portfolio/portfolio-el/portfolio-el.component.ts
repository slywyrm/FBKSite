import { Component, AfterViewInit, Input, ViewChild, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as $ from 'jquery';

import { PortfolioEl } from './../../../../shared/general.service';
import { OverlayService } from './../../../../shared/overlay.service';
import { PortfolioOverlayComponent } from './portfolio-overlay/portfolio-overlay.component';

@Component({
    selector: 'portfolio-el',
    templateUrl: 'portfolio-el.component.html',
    //providers: [OverlayService]
})
export class PortfolioElComponent implements AfterViewInit {
    @ViewChild('description') description: ElementRef;
    @ViewChild('banner') banner: ElementRef;
    @Input() element: PortfolioEl;
    @Input() id: number;
    hiding: boolean = false;

    get banner$(): JQuery {
        return $(this.banner.nativeElement);
    }

    constructor(private overlayService: OverlayService,
                @Inject(PLATFORM_ID) public platform) { }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platform)) {
            let resizeDiv = () => {
                let height = this.banner$.height();
                $('.portfolio-el-desc').height(height);
            };
            this.banner$.ready(() => resizeDiv());
            $(window).resize(() => resizeDiv());
        }
    }

    @HostListener('mouseenter') onMouseEnter(): void {
        let desc = this.description.nativeElement;
        let time = 0;
        if (this.hiding)
            time = 300;
        setTimeout(() => {
            $(desc).css('display', 'flex');
            if (desc.clientHeight == 0) {
                $(desc).css({ height: 'auto' });
                let targetHeight = $(desc).height();
                $(desc).stop().height(0).animate({ height: targetHeight }, 500);
            }
        }, time);
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        let desc = this.description.nativeElement;
        //this.banner.nativeElement.style.filter = 'brightness(1)';
        $(desc).stop().animate({ height: 0 });
        this.hiding = true;
        setTimeout(() => {
            $(desc).hide();
            this.hiding = false;
        }, 500);
    }

    @HostListener('click') onClick(): void {
        let data = {
            component: PortfolioOverlayComponent,
            inputs: {
                element: this.element
            }
        }; 
        this.overlayService.callOverlay(data);
    }

    /*@HostListener('touchend') ontouchend(): void {
        this.onClick();
    }*/

}