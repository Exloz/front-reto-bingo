import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Communication3Service } from '../../shared/services/comunication3.service';
import { CellList } from '../../shared/interfaces/cellList';
import Swal from 'sweetalert2';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game.component.html',
    styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
    private stompClient: any;
    bingoNumbers: Array<{ coordinate: number; number: number }> = [];
    marketNumbers: Array<{ coordinate: number; number: number }> = [];
    isActive: boolean = false;
    userName: String | null = null;
    checkedUser: any;

    constructor(
        private router: Router,
        private http: HttpClient,
        private route: ActivatedRoute,
        private comunication3Service: Communication3Service
    ) {}

    ngOnInit(): void {
        this.connect();
        this.route.queryParams.subscribe((params) => {
            this.userName = params['user'];
        });

        this.createBingoTable();

        this.comunication3Service.notify3();
    }

    createBingoTable() {
        this.http
            .post<any>(
                `http://localhost:8080/api/v1/gameset/create/bingotable/${this.userName}`,
                {}
            )
            .subscribe(
                (response) => {
                    this.isActive = response.isActive;
                    this.bingoNumbers = response.cellList;
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    connect() {
        const socket = new SockJS('http://localhost:8080/websocket');
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, () => {
            this.stompClient.subscribe(
                '/topic/loss',
                (message: { body: any }) => {
                    if (message.body) {
                        this.showLossPopup();
                    }
                }
            );
        });
    }

    getNumbersForColumn(
        columnIndex: number
    ): Array<{ coordinate: number; number: number }> {
        return this.bingoNumbers.filter(
            (item) => Math.floor((item.coordinate - 1) / 5) === columnIndex
        );
    }

    toggleMark(coordinate: number): void {
        let button = document.getElementById(`btn-${coordinate}`);
        if (button) {
            button.classList.toggle('marked');
        }
    }

    getMarkedNumbers(): Array<{ coordinate: number; number: number }> {
        return this.bingoNumbers.filter((item) => {
            let button = document.getElementById(`btn-${item.coordinate}`);
            return button?.classList.contains('marked');
        });
    }

    checkUserWinner() {
        const dataToSend = {
            cellList: this.marketNumbers,
        };
        this.http
            .post<CellList>(
                'http://localhost:8080/api/v1/check/winner',
                dataToSend
            )
            .subscribe({
                next: (check) => {
                    this.checkedUser = check;
                    if (check) {
                        this.showPopup('¡Has ganado!', 'success');
                        this.http
                            .post('http://localhost:8080/api/v1/notify/win', {
                                user: this.userName,
                            })
                            .subscribe();
                    } else {
                        this.showPopup('Has perdido.', 'error');
                    }
                },
                error: (error) => console.error(error),
            });
    }

    showMarketNumbers() {
        this.marketNumbers = this.getMarkedNumbers();
        this.checkUserWinner();
    }

    showPopup(message: string, icon: 'success' | 'error'): void {
        Swal.fire({
            title: message,
            icon: icon,
            confirmButtonText: 'Ok',
        }).then((result: { isConfirmed: any }) => {
            if (result.isConfirmed) {
                this.router.navigate(['/username']).then(() => {
                    location.reload();
                });
            }
        });
    }

    showLossPopup() {
        Swal.fire({
            title: 'Has perdido, alguien más ganó.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.router.navigate(['/login']);
            }
        });
    }
}

//Comentario xd
//Otro comentario
