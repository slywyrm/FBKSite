import { Component, Injector } from '@angular/core';

@Component({
    selector: 'status',
    templateUrl: 'status.component.html'
})
export class StatusComponent {
    private message: string;

    constructor(private injector: Injector) {
        this.message = injector.get('message');
    }
}