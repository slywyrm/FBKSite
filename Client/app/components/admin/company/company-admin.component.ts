import { Component, OnInit } from '@angular/core';

import { AdminService } from './../../../shared/admin.service';
import { GeneralService } from './../../../shared/general.service';

@Component({
    selector: 'company-admin',
    templateUrl: 'company-admin.component.html'
})
export class CompanyAdminComponent implements OnInit {
    profile: string;

    constructor(public generalService: GeneralService, 
                public adminService: AdminService) {}

    ngOnInit(): void {
        this.generalService.getSetting('company', 'profile')
                           .subscribe(profile => this.profile = profile.value);
    }

    save(): void {
        this.adminService.changeSetting('company', 'profile', this.profile)
                         .subscribe(r => {
                             if (r.result && r.result == 'success')
                                this.generalService.getSetting('company', 'profile', true);
                         });
    }
}