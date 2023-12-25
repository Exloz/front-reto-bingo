import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private notifier = new Subject<void>();

    // Observable to be listened to
    notifierObservable = this.notifier.asObservable();

    constructor() {}

    // Method to emit notifications
    notify() {
        this.notifier.next();
    }
}
