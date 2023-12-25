import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
    private _router = inject(Router);
    private authservice = inject(AuthService);
    private stompClient!: Client;
    public userName: string = 'Exloz';
    public messageContent: string = '';
    public messages: any[] = [];
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

    ngOnInit(): void {
        this.connect();
    }

    connect(): void {
        const url = '//localhost:8080/chat-socket';
        const socket = new SockJS(url);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
        });
        console.log(socket);

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
            body: JSON.stringify({ sender: this.userName, type: 'JOIN' }),
        });
    }

    sendMessage(): void {
        if (this.messageContent && this.stompClient.active) {
            const chatMessage = {
                sender: this.userName,
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
            message.content = message.sender + ' joined!';
        } else if (message.type === 'LEAVE') {
            message.content = message.sender + ' left!';
        }

        this.messages.push(message);
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
            this._router.navigateByUrl('/auth/log-in');
        } catch (error) {
            console.log(error);
        }
    }
}
