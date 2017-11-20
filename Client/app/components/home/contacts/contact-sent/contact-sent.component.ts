import { Component, Injector } from '@angular/core';
import { Contact, GeneralService } from './../../../../shared/general.service';
import { OverlayService } from './../../../../shared/overlay.service';

@Component({
    selector: 'contact-sent',
    templateUrl: 'contact-sent.component.html',
    providers: [GeneralService]
})
export class ContactSentComponent {
    private contact: Contact;
    private response: Contact;
    private sent: Boolean = false;

    constructor(private injector: Injector, private generalService: GeneralService, private overlayService: OverlayService) {
        this.contact = injector.get('contact');
    }

    /*Send(): void {
        this.generalService.sendContact(this.contact)
                           .subscribe(r => this.response = r);
        this.sent = true;
        setTimeout(() => {
            this.overlayService.sendData(true);
        }, 3000);
    }*/

    Cancel(): void {
        this.overlayService.disableOverlay();
    }
}