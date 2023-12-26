import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserName } from '../username/username.component';
import { ActivatedRoute } from '@angular/router';
import { Communication3Service } from '../../shared/services/comunication3.service';
import { CellList } from '../../shared/interfaces/cellList';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game.component.html',
    styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
    bingoNumbers: Array<{ coordinate: number; number: number }> = [];
    marketNumbers: Array<{ coordinate: number; number: number }> = [];
    isActive: boolean = false;
    userName: String | null = null;
    checkedUser: any;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private comunication3Service: Communication3Service
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.userName = params['user'];
        });

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
        this.comunication3Service.notify3();
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
                    console.log(this.checkedUser);
                },
                error: (error) => console.error(error),
                complete: () => {},
            });
    }

    showMarketNumbers() {
        this.marketNumbers = this.getMarkedNumbers();
        this.checkUserWinner();
    }
}
