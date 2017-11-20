import { Component, Input, Pipe, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe {
    constructor(private sanitizer: DomSanitizer) { }
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

@Component({
    selector: 'youtube',
    templateUrl: 'youtube.component.html'
})
export class YoutubeComponent implements OnInit {
    @Input() loadVideo: boolean;
    @Input() videoUrl: string = 'none';
    loadingGifPath: string = 'none';

    ngOnInit(): void {
        this.loadingGifPath = '/media/loading.gif';
    }    
}