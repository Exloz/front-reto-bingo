import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameSet } from '../../shared/interfaces/GameSet';

@Component({
    selector: 'app-user-name-input',
    standalone: true,
    imports: [FormsModule, CommonModule, HttpClientModule],
    templateUrl: './username.component.html',
    styleUrls: ['./username.component.css'],
})
export class UserName implements OnInit {
    userName: string = '';
    error: string | null = null;
    gameSet: GameSet | null = null;

    constructor(private router: Router, private http: HttpClient) {}

    ngOnInit(): void {
        this.createGameSet();
    }

    onSubmit(): void {
        if (this.userName) {
            this.router.navigate(['/home'], {
                queryParams: { user: this.userName, gameid: this.gameSet?.id },
            });
        }
    }

    createGameSet() {
        this.http
            .get<GameSet>('http://localhost:8080/api/v1/gameset/create')
            .subscribe(
                (responseData) => {
                    this.gameSet = responseData;
                    console.log(this.gameSet);
                },
                (err) => {
                    this.error = err.message;
                }
            );
    }
}
