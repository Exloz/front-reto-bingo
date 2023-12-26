import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserName } from '../username/username.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game.component.html',
    styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
    bingoNumbers: Array<{ coordinate: number; number: number }> = [];
    isActive: boolean = false;
    userName: String | null = null;

    constructor(private http: HttpClient, private route: ActivatedRoute) {}

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

                    console.log(response);
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    toggleMark(coordinate: number): void {
        let button = document.getElementById(`btn-${coordinate}`);
        if (button) {
            button.classList.toggle('marked');
        } else {
            console.error(`Button with id btn-${coordinate} not found`);
        }
    }

    getNumbersForColumn(
        columnIndex: number
    ): Array<{ coordinate: number; number: number }> {
        return this.bingoNumbers.filter(
            (item) => Math.floor((item.coordinate - 1) / 5) === columnIndex
        );
    }

    getMarkedNumbers(): Array<{ coordinate: number; number: number }> {
        return this.bingoNumbers.filter((item) => {
            let button = document.getElementById(`btn-${item.coordinate}`);
            return button && button.classList.contains('marked');
        });
    }

    checkUserWinner() {}
}
