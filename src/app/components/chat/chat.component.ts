import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from '../../shared/services/auth.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LobbyComponent } from '../lobby/lobby.component';
import { GameComponent } from '../game/game.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User } from '../../shared/interfaces/user';
import { Subscription, first } from 'rxjs';
import { CommunicationService } from '../../shared/services/comunication.service';
import { Communication2Service } from '../../shared/services/comunication2.service';
import { Communication3Service } from '../../shared/services/comunication3.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        LobbyComponent,
        FormsModule,
        CommonModule,
        MatSlideToggleModule,
        MatToolbarModule,
        GameComponent,
        HttpClientModule,
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
    public showGameComponent = false;
    private _router = inject(Router);
    private authservice = inject(AuthService);
    private stompClient!: Client;
    public userName: string = '';
    public gameSetId: string = '';
    public messageContent: string = '';
    public messages: any[] = [];
    ballotMessages: any[] = [];
    private colors: string[] = [
        '#2196F3',
        '#32c787',
        '#00BCD4',
        '#ff5652',
        '#ffc107',
        '#ff85af',
        '#FF9800',
        '#39bbb0',
    ];
    user: User | null = null;
    error: any;
    userResponse: User | null = null;
    private subscription: Subscription;
    private subscription3: Subscription;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private comunicationService: CommunicationService,
        private comunication2Service: Communication2Service,
        private comunication3Service: Communication3Service
    ) {
        this.route.queryParams.subscribe((params) => {
            this.user = {
                gameSetId: params['gameid'],
                userName: params['user'],
            };
        });
        this.subscription = this.comunicationService.notifierObservable
            .pipe(first())
            .subscribe(() => this.sendStart());

        this.subscription3 = this.comunicationService.notifierObservable
            .pipe(first())
            .subscribe(() =>
                setTimeout(() => {
                    this.sendStartBallot();
                }, 5000)
            );
    }

    ngOnInit(): void {
        this.connect();
        this.createUserOnSet();
    }

    connect(): void {
        const url = '//localhost:8080/chat-socket';
        const socket = new SockJS(url);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
        });

        this.stompClient.onConnect = (frame: any) => {
            this.onConnected(frame);
        };

        this.stompClient.activate();
    }

    private onConnected(frame: any): void {
        this.stompClient.subscribe(
            '/topic/public',
            this.onMessageReceived.bind(this)
        );
        this.stompClient.publish({
            destination: '/app/chat.addUser',
            body: JSON.stringify({ sender: this.user?.userName, type: 'JOIN' }),
        });
    }

    sendMessage(): void {
        if (this.messageContent && this.stompClient.active) {
            const chatMessage = {
                sender: this.user?.userName,
                content: this.messageContent,
                type: 'CHAT',
            };
            this.stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage),
            });
            console.log(chatMessage);

            this.messageContent = '';
        }
    }

    private onMessageReceived(payload: any): void {
        const message = JSON.parse(payload.body);

        if (message.type === 'JOIN') {
            message.content = ' ingreso al bingo!';
        } else if (message.type === 'LEAVE') {
            message.content = ' ha sido descalificado!';
        } else if (message.type === 'START') {
            this.comunication2Service.notify2();
            message.content = ' inicio el juego!';
        } else if (message.type === 'BALLOT') {
            message.content = this.letterRange(message.content);
            this.ballotMessages.push(message);
        }

        this.messages.push(message);
    }

    private letterRange(message: number): string {
        let number = message;
        let messageReturn = '';
        let prefix;

        if (number >= 1 && number <= 15) {
            prefix = 'B';
        } else if (number >= 16 && number <= 30) {
            prefix = 'I';
        } else if (number >= 31 && number <= 45) {
            prefix = 'N';
        } else if (number >= 46 && number <= 60) {
            prefix = 'G';
        } else if (number >= 61 && number <= 75) {
            prefix = 'O';
        }

        if (prefix) {
            messageReturn = prefix + message;
        }
        return messageReturn;
    }

    getAvatarColor(messageSender: string): string {
        let hash = 0;
        for (let i = 0; i < messageSender.length; i++) {
            hash = 31 * hash + messageSender.charCodeAt(i);
        }
        const index = Math.abs(hash % this.colors.length);
        return this.colors[index];
    }

    async logOut(): Promise<void> {
        try {
            await this.authservice.logOut();
            this._router.navigateByUrl('/login');
        } catch (error) {
            console.log(error);
        }
    }

    onTimerComplete() {
        this.showGameComponent = true;
    }

    createUserOnSet() {
        this.http
            .post<User>('http://localhost:8080/api/v1/user/create', this.user)
            .subscribe({
                next: (user) => (this.userResponse = user),
                error: (error) => console.error(error),
                complete: () => {},
            });
    }

    sendStart(): void {
        this.stompClient.publish({
            destination: '/app/chat.startGame',
            body: JSON.stringify({
                sender: this.user?.userName,
                type: 'START',
            }),
        });
    }

    sendStartBallot(): void {
        this.stompClient.publish({
            destination: '/app/chat.generateBallot',
            body: JSON.stringify({
                sender: this.user?.userName,
                type: 'BALLOT',
            }),
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe;
        this.subscription3.unsubscribe;
    }
}
