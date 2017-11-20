import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OverlayService } from './../../../shared/overlay.service'
import * as $ from 'jquery';

@Component({
    selector: 'overlay',
    templateUrl: 'overlay.component.html'
})
export class OverlayComponent implements OnInit, OnDestroy {
    componentData = null;
    subscription: Subscription;
    cancelPath: string = 'None';

    constructor(private overlayService: OverlayService) { 
        this.subscription = overlayService.componentData$.subscribe(data => {
            if (data == null) {
                this.hide();
                setTimeout(()=> this.componentData = null, 500);
            }
            else {
                this.componentData = data;
                this.show();
            }
        });
        overlayService.lazyLoad(false);
    }

    private show(): void {
        setTimeout(() => {
            $('#overlay').css('background-color', 'rgba(40, 40, 40, 0.8)');
            $('#main,header').addClass('overlayed');       
            $('#overlay-content,#overlay-cancel').css('opacity', '1');
            setTimeout(() => this.overlayService.lazyLoad(true), 500);
        }, 50);
    }

    private hide(): void {
        $('#overlay-content,#overlay-cancel').css('opacity', '0');
        $('#overlay').css('background-color', 'rgba(40, 40, 40, 0)');
        $('#main,header').removeClass('overlayed');
    }

    @HostListener('touchend', ['$event']) onTouchEnd(event: TouchEvent) {
        this.onClick(event.target);
        event.stopPropagation();
    }

    @HostListener('click', ['$event.target']) onClick(target): void {
        if (target.id == 'overlay-wrapper' || 
            target.parentElement.id == 'overlay-content' ||
            target.parentElement.parentElement.id == 'overlay-content' ||
            target.parentElement.id == 'overlay-cancel')
            this.overlayService.disableOverlay();
    }

    @HostListener('mousewheel') onMouseWheel(): boolean {
        return false;
    }

    ngOnInit(): void {
        this.cancelPath = '/media/cancel.png';
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}