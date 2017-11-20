import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {} from '@types/googlemaps';

import { StatusComponent } from './../status/status.component';

import { GeneralService } from './../../../shared/general.service';
import { AdminService } from './../../../shared/admin.service';
import { OverlayService } from './../../../shared/overlay.service';

@Component({
    selector: 'contacts-admin',
    templateUrl: 'contacts-admin.component.html'
})
export class ContactsAdminComponent implements OnInit {
    email: string;
    phone: string;
    address: string;

    emailSaved: boolean = false;
    phoneSaved: boolean = false;
    addressSaved: boolean = false;
    /*latSaved: boolean = false;
    lngSaved: boolean = false;*/
    positionSaved: boolean = false;

    @ViewChild('map') mapElement: ElementRef;
    map: google.maps.Map;
    marker: google.maps.Marker;

    get googleAddress(): string {
        if (this.address) {
            let address = this.address.replace(' ', '+');
            return address;
        }
        return null;
    }

    constructor(public generalService: GeneralService,
                public adminService: AdminService,
                public overlayService: OverlayService,
                @Inject(PLATFORM_ID) public platform) {}

    ngOnInit(): void {
        let map = position => {
            let mapOptions = {
                center: position,
                zoom: 16
            };

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.marker = new google.maps.Marker({
                map: this.map,
                position: position,
                draggable: true,
                label: 'Frame Bakery Office'
            });
        };

        this.generalService.getSetting('contacts', 'email')
                           .subscribe(email => this.email = email.value);
        this.generalService.getSetting('contacts', 'phone')
                           .subscribe(phone => this.phone = phone.value);
        this.generalService.getSetting('contacts', 'address')
                           .subscribe(address => this.address = address.value);
        let position = { lat: 0, lng: 0 };
        this.generalService.getSetting('contacts', 'position')
                           .subscribe(r => {
                                if (isPlatformBrowser(this.platform))
                                {
                                    let position = { lat: 0, lng: 0 };
                                    position.lat = +r.value.slice(1, r.value.length - 1).split(',')[0];
                                    position.lng = +r.value.slice(1, r.value.length - 1).split(',')[1];

                                    map(position);
                                }
                           });

        setTimeout(() => {
            if (!this.map)
                map({ lan: 0, lng: 0 });
        }, 2000);
    }

    save(): void {
        this.adminService.changeSetting('contacts', 'email', this.email)
                         .subscribe(r => this.checkSaved(r, 'email'));
        this.adminService.changeSetting('contacts', 'phone', this.phone)
                         .subscribe(r => this.checkSaved(r, 'phone'));
        this.adminService.changeSetting('contacts', 'address', this.address)
                         .subscribe(r => this.checkSaved(r, 'address'));
        /*this.adminService.changeSetting('contacts', 'lat', this.marker.getPosition().lat().toString())
                         .subscribe(r => this.checkSaved(r, 'lat'));
        this.adminService.changeSetting('contacts', 'lng', this.marker.getPosition().lng().toString())
                         .subscribe(r => this.checkSaved(r, 'lng'));*/
        this.adminService.changeSetting('contacts', 'position', this.marker.getPosition().toString())
                         .subscribe(r => this.checkSaved(r, 'position'));
    }

    checkSaved(r: any, setting: string)
    {
        if (r.result && r.result == 'success')
            switch(setting) {
                case 'email': this.emailSaved = true; break;
                case 'phone': this.phoneSaved = true; break;
                case 'address': this.addressSaved = true; break;
                /*case 'lat': this.latSaved = true; break;
                case 'lng': this.lngSaved = true; break;*/
                case 'position': this.positionSaved = true;
            }
        if (this.emailSaved && this.phoneSaved && this.addressSaved && this.positionSaved/*this.latSaved && this.lngSaved*/)
        {
            this.generalService.getSetting('contacts', 'email', true);
            this.generalService.getSetting('contacts', 'phone', true);
            this.generalService.getSetting('contacts', 'address', true);
            /*this.generalService.getSetting('contacts', 'lat', true);
            this.generalService.getSetting('contacts', 'lng', true);*/
            this.emailSaved = this.phoneSaved = this.addressSaved = this.positionSaved/*this.latSaved = this.lngSaved*/ = false;

            let data = {
                component: StatusComponent,
                inputs: {
                    message: "Contacts were updated successfully"
                }
            };
            this.overlayService.callOverlay(data);
            setTimeout(() => this.overlayService.disableOverlay(), 3000);
        }
    }

    geoCode(address: string)
    {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address }, (results, status) => {
            if (status.toString() == 'OK') {
                if (this.marker)
                    this.marker.setMap(null);
                this.map.setCenter(results[0].geometry.location);
                this.marker = new google.maps.Marker({
                    map: this.map,
                    position: results[0].geometry.location,
                    draggable: true,
                    label: 'Frame Bakery Office'
                });
            }
        });
    }
}