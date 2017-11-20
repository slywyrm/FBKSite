import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GeneralService, Contact } from './../../../shared/general.service';
import { Subscription } from 'rxjs/Subscription';
import { OverlayService } from './../../../shared/overlay.service';
import { ContactSentComponent } from './contact-sent/contact-sent.component';

@Component({
    selector: 'contacts',
    templateUrl: 'contacts.component.html',
    //providers: [GeneralService]
})
export class ContactsComponent implements OnInit, OnDestroy {
    private contact: Contact = new Contact();
    private subscription: Subscription;
    @ViewChild('contactForm') private contactForm;

    constructor(private overlayService: OverlayService) { }

    ngOnInit() {
        this.subscription = this.overlayService.data$.subscribe(sent => {
            if(sent) {
                this.contactForm.reset();
                //this.overlayService.disableOverlay();
                this.overlayService.sendData(false);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onSubmit(): void {
        let data = {
            component: ContactSentComponent,
            inputs: {
                contact: this.contact
            }
        };
        this.overlayService.callOverlay(data);
    }
}