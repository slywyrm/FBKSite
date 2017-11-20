import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
//import { Subscription } from 'rxjs/Subscription';
import { LocalStorageService } from 'angular-2-local-storage';
import { List } from 'linqts';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { PortfolioEl, Service } from './general.service';

export class User {
    email: string;
    firstName: string;
    lastName: string;
}

@Injectable()
export class AdminService {
    private token: any;
    user: User = null;
    loggedIn: boolean = false;
    redirectUrl: string = null;
    signInErrorMsgSource = new Subject<string>();
    singInErrorMsg$ = this.signInErrorMsgSource.asObservable();
    mediaList = new BehaviorSubject<any>(null);

    constructor(private http: Http, 
                private localStorageService: LocalStorageService,
                private router: Router) { 
        var currentUser = localStorageService.get('currentUser') as any;
        this.token = currentUser && currentUser.token;
        if (this.token)
            this.getProfile();
        this.signInErrorMsgSource.next(null);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error('HTTP error: AdminService: ', errMsg);
        return Observable.throw(errMsg);
    }
    
    signIn(email?: string, password?: string): Observable<boolean> {
        let params = new URLSearchParams();
        if (email && password) {
            params.append('grant_type', 'password');
            params.append('username', email);
            params.append('password', password);
        }
        else {
            if(!this.token)
                return new Observable<any>(response => response.next('no credentials submitted'));
            params.append('grant_type', 'refresh_token');
            params.append('refresh_token', this.token.refresh_token);
        }
        params.append('scope', 'openid offline_access');

        return this.http.post('account/token', params)
                .map((response: Response) => {
                    let token = response.json() &&  { access_token : response.json().access_token, refresh_token : response.json().refresh_token };
                    if (token) {
                        this.token = token;
                        this.localStorageService.set('currentUser', { username: email, token: token});
                        this.getProfile();
                        this.signInErrorMsgSource.next(null);

                        return true;
                    } else {
                        return false;
                    }                            
                })
                .catch((error, caught) => {
                    let errMsg: string;
                    if (error instanceof Response) {
                        const body = error.json() || '';
                        const err = body.error || JSON.stringify(body);
                        if (body.error == 'invalid_grant') {
                            this.signInErrorMsgSource.next(err);
                            return [];
                        }
                        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
                    }
                    else {
                        errMsg = error.message ? error.message : error.toString();
                    }
                    console.error('HTTP error: AdminService: ', errMsg);
                    return Observable.throw(errMsg);
                });
    }

    signOut(): void {
        this.loggedIn = false;
        //this._checked = false;
        this.token = null;
        this.user = null;
        this.localStorageService.remove('currentUser');
        this.router.navigate(['home']);
    }

    private get authOptions(): RequestOptions {
        let headers = new Headers({'Authorization' : 'Bearer ' + this.token.access_token });
        return new RequestOptions({ headers: headers });
    }

    private get authPostOptions(): RequestOptions {
        let options = this.authOptions;
        options.headers.append('Content-Type', 'application/json');
        return options;
    }

    getProfile(): Observable<any> {
        let call = this.http.get('admin/profile', this.authOptions)
                            .map(r => {
                                let response = r.json();
                                if (response.status && response.status == "error")
                                {
                                    this.signIn().subscribe();
                                    return response;
                                }
                                return response as User;
                            })
                            .catch(this.handleError);
        call.subscribe(r => {
            if (r.status && r.status == "error")
                return false;
            this.user = r;
            this.loggedIn = true;
            if (this.redirectUrl) {
                this.router.navigateByUrl(this.redirectUrl);
                this.redirectUrl = null;
            }
        });
        return call;
    }

    getReelFiles(): Observable<any> {
        return this.http.get('admin/getreelfiles', this.authOptions)
                        .map(r => r.json())
                        .catch(this.handleError);
    }

    sendReelFile(file: any): Observable<any> {
        let data = new FormData();
        data.append('formFile', file);

        return this.http.post('admin/sendreelfile', data, this.authOptions)
                        .map(r => r.json())
                        .catch(this.handleError);
    }

    removeReelFile(file: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('fileName', file);

        return this.http.post('admin/removereelfile', params, this.authOptions)
                        .map(r => r.json())
                        .catch(this.handleError);
    }

    chooseReel(file: string): Observable<any> {
        let params = new URLSearchParams();
        params.append('file', file);

        return this.http.post('admin/choosereel', params, this.authOptions)
                        .map(r => r.json())
                        .catch(this.handleError);
    }

    getMediaFiles(forceUpdate?: boolean): BehaviorSubject<any> {
        if (!this.mediaList.value || forceUpdate)
            this.http.get('admin/mediafiles', this.authOptions)
                    .map(data => data.json())
                    .catch(this.handleError)
                    .subscribe(data => this.mediaList.next(data));
        return this.mediaList;
    }

    sendMediaFile(file: any): Observable<any> {
        let data = new FormData();
        data.append('formFile', file);

        return this.http.post('admin/sendmediafile', data, this.authOptions)
                        .map(r => r.json())
                        .catch(this.handleError);
    }

    addPortfolioElement(element: PortfolioEl): Observable<any> {
        return this.http.post('admin/addportfolioelem', element, this.authPostOptions)
                        .map(r => r.json())
                        .catch(this.handleError);
    }

    changePortfolio(portfolio: PortfolioEl[]): Observable<any> {
        return this.http.post('admin/changeportfolio', portfolio, this.authPostOptions)
                        .map(r => r.json())
                        .catch(this.handleError);
    }

    changeServices(services: Service[]): Observable<any> {
        return this.http.post('admin/changeservices', services, this.authPostOptions)
                        .map(r => r.json())
                        .catch(this.handleError);
    }

    changeSetting(sClass: string, sName: string, sValue: string) {
        let params = new URLSearchParams();
        params.append('sClass', sClass);
        params.append('sName', sName);
        params.append('sValue', sValue);

        return this.http.post('admin/changesetting', params, this.authOptions)
                        .map(r => r.json())
                        .catch(this.handleError);
    }
}