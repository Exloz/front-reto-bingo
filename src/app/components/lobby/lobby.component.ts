import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommunicationService } from '../../shared/services/comunication.service';
import { Subscription, first } from 'rxjs';

@Component({
    selector: 'app-lobby',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './lobby.component.html',
    styleUrl: './lobby.component.css',
})
export class LobbyComponent {
    isCountdown = false;
    private subscription: Subscription;
    public showStartButton = true;
    counter = 10;
    countdownMessage: string = '';
    @Output() timerComplete = new EventEmitter<void>();

    constructor(private comunicationService: CommunicationService) {
        this.subscription = this.comunicationService.notifierObservable
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
}
