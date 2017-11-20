import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class OverlayService {
    componentDataSource = new Subject<any>();
    lazyLoadSource = new Subject<boolean>();
    dataSource = new Subject<any>();

    componentData$ = this.componentDataSource.asObservable();
    lazyLoad$ = this.lazyLoadSource.asObservable();
    data$ = this.dataSource.asObservable();

    overlayEnabled: boolean = false;

    callOverlay(componentData: any): void {
        this.componentDataSource.next(componentData);
        this.overlayEnabled = true;
    }

    disableOverlay(): void {
        this.componentDataSource.next(null);
        this.overlayEnabled = false;
    }   

    lazyLoad(lazy: boolean): void {
        this.lazyLoadSource.next(lazy);
    }

    sendData(data: any): void {
        this.dataSource.next(data);
    }
}