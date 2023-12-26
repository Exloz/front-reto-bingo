import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CommunicationService } from '../../shared/services/comunication.service';
import { Subscription, first } from 'rxjs';
import { Communication2Service } from '../../shared/services/comunication2.service';

@Component({
    selector: 'app-lobby',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnDestroy {
    isCountdown = false;
    private subscription: Subscription;
    public showStartButton = true;
    counter = 5;
    countdownMessage: string = '';
    @Output() timerComplete = new EventEmitter<void>();

    constructor(
        private comunicationService: CommunicationService,
        private comunication2Service: Communication2Service
    ) {
        this.subscription = this.comunication2Service.notifierObservable2
            .pipe(first())
            .subscribe(() => this.startCountdownNoNotify());
    }

    startCountdown() {
        this.isCountdown = true;
        this.comunicationService.notify();
        this.showStartButton = false;
        const interval = setInterval(() => {
            this.counter--;

            if (this.counter === 0) {
                clearInterval(interval);
                this.timerComplete.emit();
            } else {
                this.countdownMessage = `${this.counter} segundos restantes para iniciar`;
            }
        }, 1000);
    }

    startCountdownNoNotify() {
        if (this.isCountdown == false) {
            this.showStartButton = false;
            const interval = setInterval(() => {
                this.counter--;

                if (this.counter === 0) {
                    clearInterval(interval);
                    this.timerComplete.emit();
                } else {
                    this.countdownMessage = `${this.counter} segundos restantes para iniciar`;
                }
            }, 1000);
        }
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe;
    }
}
