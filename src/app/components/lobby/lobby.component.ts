import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-lobby',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './lobby.component.html',
    styleUrl: './lobby.component.css',
})
export class LobbyComponent {
    public showStartButton = true;
    counter = 30;
    countdownMessage: string = '';
    @Output() timerComplete = new EventEmitter<void>();

    constructor() {}

    startCountdown() {
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
