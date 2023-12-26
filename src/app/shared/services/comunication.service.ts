import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private notifier = new Subject<void>();

    notifierObservable = this.notifier.asObservable();

    constructor() {}

    notify() {
        this.notifier.next();
    }
}
