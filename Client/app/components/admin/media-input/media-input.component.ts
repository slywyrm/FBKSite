import { Component, ViewChild, Output, OnInit, Inject, EventEmitter } from '@angular/core';
import { List } from 'linqts';

import { ORIGIN_URL } from './../../../shared/constants/baseurl.constants';
import { AdminService } from './../../../shared/admin.service';

@Component({
    selector: 'media-input',
    templateUrl: 'media-input.component.html' 
})
export class MediaInputComponent implements OnInit {
    mediaList: any;
    selectedYear: string;
    selectedMonth: string;
    selectedFile: string;
    uploading: boolean = false;

    @Output() onSelected = new EventEmitter<string>();
    @ViewChild("mediaFile") file: any;

    constructor(public adminService: AdminService,
                @Inject(ORIGIN_URL) public baseUrl: string) {}

    ngOnInit() {
        console.log("");
        this.adminService.getMediaFiles().subscribe(r => {
            this.mediaList = r;
            this.selectedYear = this.mediaList && this.mediaList[0].year;
            this.selectedMonth = this.mediaList && this.mediaList[0].months[0].month;
            this.selectedFile = this.mediaList && this.mediaList[0].months[0].files[0];
        });
    }

    get years(): Array<string> {
        let years = new List<any>(this.mediaList);
        return years.Select(i => i.year).OrderByDescending(i => i).ToArray();
    }

    get months(): Array<string> {
        let years = new List<any>(this.mediaList);
        let months = new List<any>(years.Where(i => i.year == this.selectedYear).First().months);
        return months.Select(i => i.month).OrderByDescending(i => this.orderMonths(i)).ToArray();
    }

    get files(): Array<string> {
        let years = new List<any>(this.mediaList);
        let months = new List<any>(years.Where(i => i.year == this.selectedYear).First().months);
        let files = new List<string>(months.Where(i => i.month == this.selectedMonth).First().files);
        return files.ToArray();
    }

    get link(): string {
        if (this.selectedYear && this.selectedMonth && this.selectedFile)
            return `${this.baseUrl}/media/uploads/${this.selectedYear}/${this.selectedMonth}/${this.selectedFile}`;
        else
            return null;
    }

    orderMonths(month: string): number {
        switch (month) {
            case ("January"): return 1;
            case ("February"): return 2;
            case ("March"): return 3;
            case ("April"): return 4;
            case ("May"): return 5;
            case ("June"): return 6;
            case ("July"): return 7;
            case ("August"): return 8;
            case ("September"): return 9;
            case ("October"): return 10;
            case ("November"): return 11;
            case ("December"): return 12;
        }
    }

    select() {
        this.onSelected.emit(this.link);
    }

    fileUpload() {
        this.uploading = true;
        this.adminService.sendMediaFile(this.file.nativeElement.files[0]).subscribe(response => {
            if (response.result && response.result == 'error')
                alert('Error: ' + response.error);
            else if (response.result && response.result == 'success')
            {
                this.adminService.getMediaFiles(true).subscribe(r => {
                    this.selectedYear = response.year;
                    this.selectedMonth = response.month;
                    this.selectedFile = response.file;
                });
                this.onSelected.emit(`${this.baseUrl}/` + response.link);
            }
            this.uploading = false;
        });
    }
}