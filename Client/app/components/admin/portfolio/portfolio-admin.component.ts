import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { List } from 'linqts';

import { GeneralService, PortfolioEl } from './../../../shared/general.service';
import { AdminService } from './../../../shared/admin.service';
import { OverlayService } from './../../../shared/overlay.service';
import { StatusComponent } from './../status/status.component';

@Component({
    selector:'portfolio-admin',
    templateUrl:'portfolio-admin.component.html'
})
export class PortfolioAdminComponent implements OnInit {
    portfolio: List<PortfolioEl>;
    filter: string = "";
    changed: boolean = false;

    constructor(public router: Router,
                public route: ActivatedRoute,
                public generalService: GeneralService,
                public adminService: AdminService,
                public overlayService: OverlayService) {}

    ngOnInit() {
        this.generalService.getPortfolio()
                           .subscribe(data => this.portfolio = data && new List<PortfolioEl>(data));
    }

    get orderedPortfolio(): Array<PortfolioEl> {
        if (this.portfolio)
            return this.portfolio.Where(item => item.name.toLowerCase().includes(this.filter.toLowerCase()))
                                 .OrderByDescending(item => item.order).ToArray();
        else
            return null;
    }

    onFilterKey(value: string) {
        if (value)
            this.filter = value;
    }

    onSelect(id : number | string) {
        this.router.navigate([id], { relativeTo: this.route });
    }

    changeOrder(id: number, delta: number) {
        let oldOrder = this.portfolio.Where(i => i.id == id).Select(i => i.order).FirstOrDefault();
        let newOrder = this.portfolio.Where(i => i.order == oldOrder + delta)
                           .Select(i => { let temp = i.order; i.order = oldOrder; return temp; })
                           .FirstOrDefault();
        if (Number.isInteger(newOrder))
            this.portfolio.Where(i => i.id == id).Select(i => i.order = newOrder);
    }

    removeElement(id: number) {
        let element = this.portfolio.Where(i => i.id == id).SingleOrDefault();
        if (element)
            this.portfolio.Remove(element);
    }

    addElement() {
        this.router.navigate([-1], { relativeTo: this.route });
    }

    saveChanges() {
        this.adminService.changePortfolio(this.portfolio.ToArray())
                         .subscribe(r => {
                             if (r.result && r.success)
                             {
                                 this.generalService.getPortfolio(true);
                                 let data = {
                                     component: StatusComponent,
                                     inputs: {
                                         message: "Portfolio was updated successfully"
                                     }
                                 };
                                 this.overlayService.callOverlay(data);
                                 setTimeout(() => this.overlayService.disableOverlay(), 3000);
                             }
                         })
    }
}