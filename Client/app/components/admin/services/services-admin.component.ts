import { Component, OnInit } from '@angular/core';
import { List } from 'linqts';
import * as $ from 'jquery';

import { AdminService } from './../../../shared/admin.service';
import { GeneralService, Service } from './../../../shared/general.service';
import { OverlayService } from './../../../shared/overlay.service';
import { StatusComponent } from './../status/status.component';

@Component({
    selector: 'services-admin',
    templateUrl: 'services-admin.component.html'
})
export class ServicesAdminComponent implements OnInit {
    private services: List<Service>;
    private selectedService: Service;

    private get orderedServices(): Service[] {
        return this.services.OrderBy(i => i.order).ToArray();
    }

    constructor(private generalService: GeneralService,
                private adminService: AdminService,
                private overlayService: OverlayService) {}

    ngOnInit(): void {
        this.generalService.getServices().subscribe(services => this.services = new List<Service>(services));
        setTimeout(() => {
            for (let service of this.services.ToArray()) {
                $(`.${service.id.split(' ').join('')}`).css({
                    backgroundColor: service.bgColor,
                    color: service.textColor
                });
            }
        }, 200);
    }

    private selectService(service: Service) {
        if (this.selectedService)
            this.services.Where(i => i.id == this.selectedService.id).Select(i => i = this.selectedService);
        this.selectedService = service;
    }

    private changeOrder(id: string, delta: number) {
        let oldOrder = this.services.Where(i => i.id == id).Select(i => i.order).FirstOrDefault();
        let newOrder = this.services.Where(i => i.order == oldOrder + delta)
                           .Select(i => { let temp = i.order; i.order = oldOrder; return temp; })
                           .FirstOrDefault();
        if (Number.isInteger(newOrder))
            this.services.Where(i => i.id == id).Select(i => i.order = newOrder);
    }

    private changeBgColor(id: string) {
        $(`.${id.split(' ').join('')}`).css({ backgroundColor: this.selectedService.bgColor });        
    }

    private changeTextColor(id: string) {
        $(`.${id.split(' ').join('')}`).css({ color: this.selectedService.textColor });        
    }

    private saveChanges() {
        this.adminService.changeServices(this.services.ToArray())
                         .subscribe(r => {
                             if (r.result && r.result == 'success') {
                                 this.generalService.getServices(true);
                                 let data = {
                                     component: StatusComponent,
                                     inputs: {
                                         message: "Services were updated successfully"
                                     }
                                 };
                                 this.overlayService.callOverlay(data);
                                 setTimeout(() => this.overlayService.disableOverlay(), 2000);
                             }                             
                         });
    }
}