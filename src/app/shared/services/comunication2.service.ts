import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Communication2Service {
    private notifier2 = new Subject<void>();

    notifierObservable2 = this.notifier2.asObservable();

    constructor() {}

    notify2() {
        this.notifier2.next();
    }
}
