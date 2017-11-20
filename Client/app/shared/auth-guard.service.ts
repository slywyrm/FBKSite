import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminService } from './admin.service';
import { OverlayService } from './overlay.service';
import { LoginComponent } from './../components/admin/login/login.component';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private adminService: AdminService, 
                private overlayService: OverlayService, 
                private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let url: string = route.url.toString();
        return Observable.fromPromise(this.check(url));
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.canActivate(route, state);
    }

    private async check(url: string): Promise<boolean> {
        await this.adminService.getProfile().toPromise();
        return this.adminService.loggedIn;
        /*return this.adminService.waitLoggedIn.map(loggedIn => {
            if (loggedIn) { 
                console.log("AuthGuard checked true")
                return true; 
            }

            console.log("AuthGuard checked false")

            this.adminService.redirectUrl = url;
            let data = {
                component: LoginComponent,
                inputs: { }
            };
            this.overlayService.callOverlay(data);

            return false;
        });  */      
    }
}