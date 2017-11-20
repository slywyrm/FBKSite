import { Injectable, Inject } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { ORIGIN_URL } from './constants/baseurl.constants';
import 'zone.js';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { List } from 'linqts';

export class Setting {
    sClass: string;
    name: string;
    value: string;
}

export class PortfolioEl {
    id: number;
    name: string;
    year: number;
    production: string;
    banner: string;
    director: string;
    operator: string;
    decription: string;
    productionStart: string;
    productionEnd: string;
    shotsNumber: number;
    imdb: string;
    rottenTomatoes: string;
    kinopoisk: string;
    facebook: string;
    twitter: string;
    vkontakte: string;
    stillAspectRatio: number;
    stills: any;
    order: number;
}

export class Service {
    id: string;
    description: string;
    //iconFA: string;
    iconURL: string;
    iconStaticURL: string;
    bgColor: string;
    textColor: string;
    order: number;
}

export class Contact {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export class User {
    email: string;
    firstname: string;
    lastname: string;
}

@Injectable()
export class GeneralService {
    private portfolio = new BehaviorSubject<PortfolioEl[]>(null);
    private settings = new BehaviorSubject<Setting[]>(null);
    private settingsLoading: boolean = false;
    private services = new BehaviorSubject<Service[]>(null);
    siteLoading = new BehaviorSubject<boolean>(true);
    messageSentSource = new Subject<boolean>();
    messageSent$ = this.messageSentSource.asObservable();

    constructor(private http: Http,
                private tHttp: TransferHttp,
                @Inject(ORIGIN_URL) private baseUrl: string,
                private localStorageService: LocalStorageService) { }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || { };
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
        console.error('HTTP error: GeneralService: ', errMsg);
        return Observable.throw(errMsg);
    }
    
    getSetting(setClass: string, setName: string, forceUpdate?: boolean): Observable<Setting> {
        if ((!this.settings.value || forceUpdate) && !this.settingsLoading) {
            this.settingsLoading = true;
            this.tHttp.get(`${this.baseUrl}/home/getsettings`)
                    .map(data => data as Setting[])
                    .catch(this.handleError)
                    .subscribe(data => {
                            this.settings.next(data);
                            this.settingsLoading = false;
                    });
        }
        return this.settings.map(i => {
            if (this.settings.value) {
                let data = new List<Setting>(this.settings.value);
                return data.Where(i => i.sClass == setClass && i.name == setName).SingleOrDefault();
            }
            return null;
        }).filter(data => data != null);
    }

    getPortfolio(forceUpdate: boolean = false): Observable<PortfolioEl[]> {
        if(!this.portfolio.value || forceUpdate)
            this.tHttp.get(`${this.baseUrl}/home/getportfolio`)
                    .map(data =>data as PortfolioEl[])
                    .catch(this.handleError)
                    .subscribe(data => this.portfolio.next(data));
        return this.portfolio.filter(data => data != null);
    }

    getServices(forceUpdate? : boolean): Observable<Service[]> {
        if (!this.services.value || forceUpdate)
            this.tHttp.get(`${this.baseUrl}/home/getservices`)
                      .map(data => data as Service[])
                      .catch(this.handleError)
                      .subscribe(data => this.services.next(data));
        return this.services.filter(data => data != null);
    }

    /*sendContact(contact: Contact): Observable<Contact> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('home/addcontact', contact, options)
                .map(this.extractData)
                .catch(this.handleError);
    }*/

    messangeSent(sent: boolean) {
        this.messageSentSource.next(sent);
    }
}