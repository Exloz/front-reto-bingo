import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Communication3Service {
    private notifier3 = new Subject<void>();

    notifierObservable3 = this.notifier3.asObservable();

    constructor() {}

    notify3() {
        this.notifier3.next();
    }
}
