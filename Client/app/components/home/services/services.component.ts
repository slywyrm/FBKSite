import { Component, OnInit, Input, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { List } from 'linqts';
import * as $ from 'jquery';

import { GeneralService, Service } from './../../../shared/general.service';
import { CenterElementDirective } from './../../../shared/center-element.directive';

@Component({
    selector: 'services',
    templateUrl: 'services.component.html',
    providers: [GeneralService],
})
export class ServicesComponent implements OnInit {
    private services: List<Service>;
    @Input() private selectedService: Service =  null;
    @ViewChild(CenterElementDirective) div: CenterElementDirective;
    //private inAnimation: boolean = false;

    constructor(private generalService: GeneralService,
                @Inject(PLATFORM_ID) public platform: Object) { }

    ngOnInit(): void {
        this.getServices();
        /*if (isPlatformBrowser(this.platform))
            setTimeout(() => {
                if (this.services)
                    this.selectService(this.services.Where(i => i.order == 0).SingleOrDefault(), true);
            }, 500);*/
    }

    private getServices(): void {
        this.generalService.getServices().subscribe(services => {
            this.services = new List<Service>(services);
            //setTimeout(() => this.div.centerElement(), 50);
        });
    }

    private get orderedServices(): Service[] {
        return this.services.OrderBy(i => i.order).ToArray();
    }

    /*private contentPOpacity(opacity: number) {
        this.$content.children('p').css('opacity', opacity);
    }

    private animateHeight(currentHeight: number): void {
        setTimeout(() => {
            this.$content.css('height', 'auto');
            let targetHeight = this.$content.height();
            this.contentPOpacity(1);
            this.$content.height(currentHeight).stop().animate({
                height: targetHeight
            }, 500);
            setTimeout(() => this.inAnimation = false, 500);
        });
    } 

    private changeSelectedService(service: Service): void {
        this.inAnimation = true;
        if (this.selectedService == service) {
            this.contentPOpacity(0);
            this.$content.stop().animate({ height: 0 }, 500);
            setTimeout(() => {
                this.selectedService = null

            }, 500);  
        }
        else if(this.selectedService == null) {
            this.selectedService = service;
            this.animateHeight(0);
        }
        else {
            let currentHeight = this.$content.height();
            this.contentPOpacity(0);
            this.selectedService = service;
            this.animateHeight(currentHeight);          
        }
    }

    private changeColors() {
        let elements = $('.service-active .services-btn-name, .services-content');
        elements.css({ 
            backgroundColor: this.selectedService.bgColor,
            color: this.selectedService.textColor
        });
    }*/

    private selectService(service: Service, start?: boolean): void {
        let currentHeight = 0;        
        if (this.selectedService) {
            $('.services-content p').css('opacity', 0);
            //currentHeight = $('.services-content').height();
            $('.service-active .services-btn-name, .services-content').removeAttr('style');
        }
        setTimeout(() => {
            //$('.services-content').css({ height: 'auto' });
            this.selectedService = service;
            setTimeout(() => {
                /*let targetHeight = $('.services-content').height();            
                $('.services-content').height(currentHeight).css({ 
                    height: targetHeight });*/
                //this.div.centerElement(targetHeight, true, 500);
                $('.services-content p').css('opacity', 1);
                if (!start) {
                    let scrollTo = $('#services').offset().top;
                    $('html body').animate({ scrollTop: scrollTo }, 500, 'swing');
                }
                /*$('.services-content').css({
                    backgroundColor: this.selectedService.bgColor,
                    color: this.selectedService.textColor
                });*/
                $('.service-active .services-btn-name').css({
                    backgroundColor: this.selectedService.bgColor,
                    color: this.selectedService.textColor
                });
                //this.div.centerElement(targetHeight + $('.services-nav').height(), true, 500);
            });
        }, 1);
    }

    /*private navClicked(service: Service) {
        if (this.inAnimation) {
            setTimeout(() => this.changeSelectedService(service), 300);        
        }
        else {
            this.changeSelectedService(service);
        }
        this.changeSelectedService(service);
        //setTimeout(() =>this.changeColors(), 600);
    }*/
}