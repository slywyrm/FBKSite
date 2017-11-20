import { Component, Directive, ElementRef, Input, OnInit, AfterViewInit, ViewChildren, QueryList, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { List } from 'linqts';
import * as $ from 'jquery';

import { GeneralService, PortfolioEl } from './../../../shared/general.service';
import { PortfolioElComponent } from './portfolio-el/portfolio-el.component';
import { OnEventEnd } from './../../../shared/on-event-end'

@Directive({
    selector: '[portfolioLine]'
})
export class PortfolioLineDirective {
    @Input() index: number;

    constructor(public element: ElementRef) {}

    public get height() {
        return $(this.element.nativeElement).height();
    }

    public get element$() {
        return $(this.element.nativeElement);
    }
}

@Component({
    selector: 'portfolio',
    templateUrl: 'portfolio.component.html',
    providers: [GeneralService]
})
export class PortfolioComponent implements OnInit, AfterViewInit {
    private portfolio: List<PortfolioEl>;
    private maxOrder: number;
    //private displayedItems: number;
    displayedLines: number = 1;
    private displayMoreButton: boolean = false;
    private displayHideButton: boolean = false;
    animating: boolean = false;
    //@ViewChildren(PortfolioElComponent) elements: QueryList<PortfolioElComponent>;
    @ViewChildren(PortfolioLineDirective) linesQuery: QueryList<PortfolioLineDirective>;
    dividedLines: Array<any>;

    get lineNum(): number {
        return isPlatformBrowser(this.platform) && $(window).width() <= 1000 && window.innerWidth < window.innerHeight ? 4 : 5;
    }

    get lines(): List<PortfolioLineDirective> {
        return new List<PortfolioLineDirective>(this.linesQuery.toArray());
    }

    getDividedLines(): Array<any> {
        let lines = new List<any>();
        //let maxOrder = this.portfolio.Select(e => e.order).Max();
        lines.Add(this.portfolio.Where(e => e.order > this.maxOrder - this.lineNum));
        lines.Add(this.portfolio.Where(e => e.order <= this.maxOrder - this.lineNum && e.order > this.maxOrder - this.lineNum * 2));
        lines.Add(this.portfolio.Where(e => e.order <= this.maxOrder - this.lineNum * 2));
        return lines.ToArray();
    }

    constructor(private generalService: GeneralService,
                @Inject(PLATFORM_ID) public platform: Object) { }

    ngOnInit(): void {
        this.getPortfolio();        
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platform))
        {
            //this.displayedItems = this.lineNum;
            
            if (navigator && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                let event = new OnEventEnd();
                $(window).on("orientationchange", () => event.event(() => {
                    //this.displayedItems = this.lineNum;
                    this.displayedLines = 1;
                    this.dividedLines = this.getDividedLines();
                    this.animateButtons(1);
                    this.onLoad();
                }));
            }
            let event = new OnEventEnd();
            $(window).resize(() => event.event(() => {
                $('.portfolio').css({ height: 'auto' });
            }));

            $('#portfolio .buttons div').on('touchstart', e => this.animatePortfolio(e));
            $('#portfolio .buttons div').on('touchmove', e => this.stopPropagation(e));
            $('#portfolio .buttons div').on('touchend', e => this.stopPropagation(e));
        }
    }

    onLoad(): void {
        if (isPlatformBrowser(this.platform)) {
            $('.portfolio').css({ height: 'auto' });
            setTimeout(() => {
                let height = $('.portfolio').height();
                $('.portfolio').css({ height: height });
            }, 50);
        }
    }

    private getPortfolio(): void {
        this.generalService.getPortfolio().subscribe(data => {
            if (data) {
                this.portfolio = new List<PortfolioEl>(data);
                this.maxOrder = this.portfolio.Select(i => i.order).Max();
                this.displayMoreButton = this.portfolio.Count() > this.lineNum;
                this.dividedLines = this.getDividedLines();
            }
        });
    }

    /*private get displayedPortfolio(): Array<PortfolioEl> {
        if (this.portfolio) {
            return this.portfolio.Where(i => i.order > this.maxOrder - this.displayedItems)
                                 .OrderByDescending(item => item.order).ToArray();
        }
        return null;
    }*/

    lineItems(line: List<PortfolioEl>): Array<PortfolioEl> {
        if (line) {
            return line.OrderByDescending(e => e.order).ToArray();
        }
        return null;
    }

    /*private changeDisplayedItemsNumber(forceChange?: boolean): number {
        if (forceChange)
            this.displayedItems = this.portfolio.Count();
        else if (this.displayedItems == this.lineNum)
            this.displayedItems = this.portfolio.Count() > this.lineNum * 2 ? this.lineNum * 2 : this.portfolio.Count();
        else if (this.displayedItems == this.portfolio.Count())
        {
            this.displayedItems = this.lineNum;
            return;
        }
        else if (this.displayedItems == this.lineNum * 2)
            this.displayedItems = this.portfolio.Count();
        return this.displayedItems;
    }*/

    private animateButtons(button: number) {
        if (button) {
            $('#hideButton').animate( { opacity: 0 }, 250);
            setTimeout(() => {
                this.displayHideButton = false;
                this.displayMoreButton = true;
                $('#moreButton').animate({ opacity: 1 }, 250);
            }, 250);            
        }
        else {
            $('#moreButton').animate( { opacity: 0 }, 250);
            setTimeout(() => {
                this.displayHideButton = true;
                this.displayMoreButton = false;
                $('#hideButton').animate({ opacity: 1 }, 250);
            }, 250);            
        }
    }

    private animateScroll(scrollTop: number, top?: boolean) {
        $('html body').stop().scrollTop(scrollTop).animate({ scrollTop: $('#portfolio').offset().top }, 500, 'swing');
    }

    animatePortfolio(event: any): void {
        event.stopPropagation();
        event.preventDefault();

        if (this.animating)
            return;

        this.animating = true;

        if (this.displayedLines < 3) {
            let currentHeight = $('.portfolio').height();
            $('.portfolio').height(currentHeight);
            this.displayedLines++;
            //setTimeout(() => {
            let changeHeight = () => {
                if ($(`#portfolio-line${this.displayedLines-1}`).length) {
                    let height = currentHeight * this.displayedLines / (this.displayedLines - 1);
                    $('.portfolio').animate({ height: height }, 500);
                    setTimeout(() => $('.portfolio').css({ height: 'auto' }), 501);
                }
                else
                    setTimeout(() => changeHeight(), 50);
            }
            changeHeight();
            //}, 50);
            if (this.displayedLines == 3)
                this.animateButtons(0);
        }
        else {
            this.animateScroll($('html body').scrollTop());
            let height = this.lines.Where(e => e.index == 0).Single().height;
            $('.portfolio').animate({ height: height }, 500);
            setTimeout(() => {
                this.displayedLines = 1;
                $('.portfolio').css({ height: 'auto' });
            }, 501);
            this.animateButtons(1);
        }
        setTimeout(() => this.animating = false, 510);
    }

    /*private animatePortfolio(event: any): void {
        event.stopPropagation();
        event.preventDefault();

        if (this.displayedItems == this.portfolio.Count())
            this.animateScroll($('html body').scrollTop());

        let currentHeight = $('.portfolio').height();
        $('.portfolio').height(currentHeight);
        let prevNum = this.displayedItems;
        this.changeDisplayedItemsNumber();
        let nextNum = this.displayedItems;
        if (this.displayedItems == this.portfolio.Count())
            this.animateButtons(0);
        else if (this.displayedItems == this.lineNum)
            this.animateButtons(1);
                            
        setTimeout(() => {
            $('.portfolio').css({ height: 'auto' });
            let targetHeight = $('.portfolio').height();
            $('.portfolio').height(currentHeight);
            setTimeout(() => {
                $('.portfolio').animate({ height: targetHeight }, 500, 'swing');
                setTimeout(() => $('.portfolio').css({ height: 'auto' }), 500);
            });
            
        }, 100);
    }*/

    stopPropagation(event: any) {
        event.stopPropagation();
        event.preventDefault();
    }
}