import { Component, ViewChild } from '@angular/core';
import { AdminService } from './../../../shared/admin.service';
import { List } from 'linqts';

@Component({
    selector: 'reel-admin',
    templateUrl: 'reel-admin.component.html'
})
export class ReelAdminComponent {
    private mediaList = null;
    private clickedItem: string = "";
    @ViewChild('mediaFile') file: any;

    constructor(private adminService: AdminService) { }
    
    ngOnInit() {
        this.adminService.getReelFiles().subscribe(r => { 
            this.mediaList = r;
        });
        //this.file.nativeElement.addEventListener()
    }

    onSubmit() {
        if (this.file)
        {
            for (var file of this.mediaList.files)
                if (this.file.nativeElement.files[0].name == file.name)
                {
                    alert('file with such name already exists, it will be renamed');
                    break;
                }
            this.adminService.sendReelFile(this.file.nativeElement.files[0]).subscribe(response => {
                if (response.result && response.result == 'error')
                    alert('Error: ' + response.error);
                else if (response.result && response.result == 'success')
                    this.mediaList.files.append(response.file);
            });
        }            
    }

    selectFile(file: string) {
        if (file != this.mediaList.selected) {
            this.adminService.chooseReel(file).subscribe(r => {
                if (r.result && r.result == "success")
                    this.mediaList.selected = file;
            });
        }
    }

    removeFile(file: string) {
        this.adminService.removeReelFile(file).subscribe(r => {
            if (r.result && r.result == 'success')
                for (var i = 0; i < this.mediaList.files.length; i++)
                    if (this.mediaList.files[i].name == file) {
                        delete this.mediaList.files[i];
                        break;
                    }

        });
    }
}