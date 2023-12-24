import { Component, OnInit } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
})
export class ChatComponent {
    private stompClient: any = null;
    public userName: string = '';
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

}
