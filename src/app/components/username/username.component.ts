import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-name-input',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './username.component.html',
    styleUrls: ['./username.component.css'],
})
export class UserName {
    userName: string = '';

    constructor(private router: Router) {}

    onSubmit(): void {
        if (this.userName) {
            this.router.navigate(['/home'], {
                queryParams: { user: this.userName },
            });
        }
    }
}
