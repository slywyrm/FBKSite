import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {} from '@types/googlemaps';

import { GeneralService } from './../../../shared/general.service';

@Component({
    selector: 'contacts-overlay',
    templateUrl: 'contacts-overlay.component.html'
})
export class ContactsOverlayComponent implements OnInit {
    email: string;
    phone: string;
    address: string;

    @ViewChild('map') mapElement: ElementRef;
    map: google.maps.Map;
    marker: google.maps.Marker;
    
    constructor(public generalService: GeneralService,
                @Inject(PLATFORM_ID) public platform: Object) {}

    ngOnInit() {
        this.generalService.getSetting('contacts', 'email')
                           .subscribe(r => this.email = r.value);
        this.generalService.getSetting('contacts', 'phone')
                           .subscribe(r => this.phone = r.value);
        this.generalService.getSetting('contacts', 'address')
                           .subscribe(r => this.address = r.value);

        /*let position = { lat: 0, lng: 0 };
        this.generalService.getSetting('contacts', 'lat')
                           .subscribe(lat => position.lat = +lat.value);
        this.generalService.getSetting('contacts', 'lng')
                           .subscribe(lng => position.lng = +lng.value);*/
        this.generalService.getSetting('contacts', 'position')
                           .subscribe(r => {
                                if (isPlatformBrowser(this.platform))
                                {
                                    let position = { lat: 0, lng: 0 };
                                    position.lat = +r.value.slice(1, r.value.length - 1).split(',')[0];
                                    position.lng = +r.value.slice(1, r.value.length - 1).split(',')[1];
                                    let map = () => {
                                        try {
                                            let mapOptions = {
                                                center: position,
                                                zoom: 16, 
                                                styles: [
                                                    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                                                    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                                                    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                                                    {
                                                    featureType: 'administrative.locality',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#d59563'}]
                                                    },
                                                    {
                                                    featureType: 'poi',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#d59563'}]
                                                    },
                                                    {
                                                    featureType: 'poi.park',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#263c3f'}]
                                                    },
                                                    {
                                                    featureType: 'poi.park',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#6b9a76'}]
                                                    },
                                                    {
                                                    featureType: 'road',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#38414e'}]
                                                    },
                                                    {
                                                    featureType: 'road',
                                                    elementType: 'geometry.stroke',
                                                    stylers: [{color: '#212a37'}]
                                                    },
                                                    {
                                                    featureType: 'road',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#9ca5b3'}]
                                                    },
                                                    {
                                                    featureType: 'road.highway',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#746855'}]
                                                    },
                                                    {
                                                    featureType: 'road.highway',
                                                    elementType: 'geometry.stroke',
                                                    stylers: [{color: '#1f2835'}]
                                                    },
                                                    {
                                                    featureType: 'road.highway',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#f3d19c'}]
                                                    },
                                                    {
                                                    featureType: 'transit',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#2f3948'}]
                                                    },
                                                    {
                                                    featureType: 'transit.station',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#d59563'}]
                                                    },
                                                    {
                                                    featureType: 'water',
                                                    elementType: 'geometry',
                                                    stylers: [{color: '#17263c'}]
                                                    },
                                                    {
                                                    featureType: 'water',
                                                    elementType: 'labels.text.fill',
                                                    stylers: [{color: '#515c6d'}]
                                                    },
                                                    {
                                                    featureType: 'water',
                                                    elementType: 'labels.text.stroke',
                                                    stylers: [{color: '#17263c'}]
                                                    }
                                                ]
                                            };

                                            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
                                            this.marker = new google.maps.Marker({
                                                map: this.map,
                                                position: position,
                                                draggable: true,
                                                label: { text: 'Frame Bakery Office', color: '#f3cf9b' }
                                            });
                                        }
                                        catch (err) {
                                            setTimeout(() => map(), 50);
                                        }
                                    };
                                    map();
                                }
                           });
        
    }
}