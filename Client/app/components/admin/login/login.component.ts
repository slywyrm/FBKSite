import { Component } from '@angular/core';
import { AdminService, User } from './../../../shared/admin.service';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    email: string = "";
    password: string = "";
    wrongCreds: boolean = false;
    errorMsg: string = null;

    constructor(public adminService: AdminService) {}

    onSubmit() {
        this.adminService.signIn(this.email, this.password).subscribe(r => this.wrongCreds = !r);
        this.adminService.singInErrorMsg$.subscribe(r => this.errorMsg = r);
    }
    
}