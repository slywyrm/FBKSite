import { Component, OnInit, ViewChild } from '@angular/core';

import { GeneralService, Setting } from './../../../shared/general.service';
import { CenterElementDirective } from './../../../shared/center-element.directive';

@Component({
    selector: 'company',
    templateUrl: 'company.component.html',
    providers: [GeneralService]
})
export class CompanyComponent implements OnInit {
    @ViewChild(CenterElementDirective) div: CenterElementDirective;

    private profile: Setting = {
        sClass: 'company',
        name: 'profile',
        value: ''
    };

    constructor(private generalService: GeneralService) { }

    ngOnInit(): void {
        this.getProfile();
    }

    getProfile(): void {
        this.generalService.getSetting('company', 'profile')
            .subscribe(profile => {
                this.profile = profile && profile;
                //setTimeout(() => this.div.centerElement(), 10);
            });
    }
}