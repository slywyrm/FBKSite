import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { List } from 'linqts';

import { GeneralService, PortfolioEl } from './../../../../shared/general.service';
import { AdminService } from './../../../../shared/admin.service';
import { OverlayService } from './../../../../shared/overlay.service';
import { StatusComponent } from './../../status/status.component';

@Component({
    selector: 'portfolio-el-admin',
    templateUrl: 'portfolio-el-admin.component.html'
})
export class PortfolioElAdminComponent implements OnInit {
    element: PortfolioEl;
    stillAR: string;
    stillARError: boolean = false;
    
    constructor(public route: ActivatedRoute,
                public router: Router,
                public generalService: GeneralService,
                public adminService: AdminService,
                public overlayService: OverlayService) {}

    ngOnInit() {
        this.route.params
            .subscribe(async (params: Params) => { 
                if (+params['id'] == -1)
                {
                    this.element = new PortfolioEl();
                    this.generalService.getPortfolio().subscribe(data => {
                        let portfolio = new List<any>(data);
                        this.element.order = portfolio.Select(i => i.order).Max() + 1;
                        this.stillAR = '';
                    })
                }   
                else
                    this.generalService.getPortfolio().subscribe(data => {
                        let portfolio = new List<PortfolioEl>(data);
                        this.element = portfolio.FirstOrDefault(item => item.id == +params['id']);
                        this.stillAR = this.element.stillAspectRatio.toString();
                    });
            });
    }

    get start(): string {
        if (this.element.productionStart) {
            let year = this.element.productionStart.split('-')[0];
            let month = this.element.productionStart.split('-')[1]
            return year + '-' + month;
        }
        return null;
    }

    set start(date: string) {
        this.element.productionStart = date + '-01T00:00:00';
    }

    get end(): string {
        if (this.element.productionEnd) {
            let year = this.element.productionEnd.split('-')[0];
            let month = this.element.productionEnd.split('-')[1]
            return year + '-' + month;
        }
        return null;
    }

    set end(date: string) {
        this.element.productionEnd = date + '-01T00:00:00';
    }

    bannerSelect(url: string): void {
        this.element.banner = url;
    }

    changeAspectRatio(value: string) {
        this.stillARError = false;
        try {
            this.element.stillAspectRatio = eval(value);
            this.stillAR = this.element.stillAspectRatio.toString();
        }
        catch (error) {
            this.stillAR = '';
            this.stillARError = true;
        }
    }

    startChanged(): void {
        let start = this.element.productionStart? new Date(this.element.productionStart + 'Z') : null;
        let end = this.element.productionEnd? new Date(this.element.productionEnd + 'Z') : null;
        if (start) {
            if (!end || start > end)
                this.element.productionEnd = this.element.productionStart;
        }
    }

    get stills() {
        let list = new List<any>(this.element.stills);
        return list.OrderBy(item => item.order).ToArray();
    }

    changeStill(id: number, newStill: string): void {
        for (let i = 0; i < this.element.stills.length; i++)
            if (this.element.stills[i].id == id)
            {
                this.element.stills[i].image = newStill;
                break;
            }
    }

    changeStillOrder(id: number, delta: number) {
        let list = new List<any>(this.element.stills);
        let oldOrder = list.Where(i => i.id == id).Select(i => i.order).FirstOrDefault();
        let newOrder = list.Where(i => i.order == oldOrder + delta)
                           .Select(i => { let temp = i.order; i.order = oldOrder; return temp; })
                           .FirstOrDefault();
        if(newOrder) {
            list.Where(i => i.id == id).Select(i => i.order = newOrder);
            this.element.stills = list.ToArray();
        }
    }

    addStill(): void {
        let list = new List<any>(this.element.stills);
        let id = list.Select(i => i.id).Max() + 1;
        let order = list.Select(i => i.order).Max() + 1;
        this.element.stills.push({ id: id, image: '', order: order });
    }

    removeStill(id: number) {
        let list = new List<any>(this.element.stills);
        list.Remove(list.Where(i => i.id == id).SingleOrDefault());
        this.element.stills = list.ToArray();
    }

    save(): void {
        this.adminService.addPortfolioElement(this.element)
                         .subscribe(r => {
                            if (r.result && r.result == 'success')
                            {
                                let data = {
                                    component: StatusComponent,
                                    inputs: {
                                        message: 'Portfolio element was successfully saved'
                                    }
                                }
                                this.overlayService.callOverlay(data);
                                this.generalService.getPortfolio(true);
                                setTimeout(() => {
                                    this.overlayService.disableOverlay();
                                    this.router.navigate(['admin', 'portfolio']);
                                }, 3000);
                            }
                         });
    }
}