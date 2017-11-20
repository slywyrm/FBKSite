export class OnEventEnd {
    private inProgress: boolean = false;

    event(action: any, params: any = null) {
        if (!this.inProgress)
        {
            this.inProgress = true;
            setTimeout(() => {
                action(params);
                this.inProgress = false;
            }, 100);
        }
    }
}