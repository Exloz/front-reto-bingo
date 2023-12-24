// import { Injectable } from '@angular/core';
// import { Stomp } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
// import { ChatMessage } from '../models/chat-message';

// @Injectable({
//     providedIn: 'root',
// })
// export class ChatService {
//     private stompClient: any;

//     constructor() {
//         this.initConnectionSocket;
//     }

//     initConnectionSocket() {
//         const url = '//localhost:8080/chat-socket';
//         const socket = new SockJS(url);
//         this.stompClient = Stomp.over(socket);
//     }

//     joinGameSet(roomId: String) {
//         this.stompClient.connect({}, () => {
//             this.stompClient.suscribe(`/topic/${roomId}`, (messages: any) => {
//                 const messageContent = JSON.parse(messages.body);
//                 console.log(messageContent);
//             });
//         });
//     }

//     sendMessage(roomId: String, ChatMessage: ChatMessage) {
//         this.stompClient.send(
//             `/app/chat/${roomId}`,
//             {},
//             JSON.stringify(ChatMessage)
//         );
//     }
// }
