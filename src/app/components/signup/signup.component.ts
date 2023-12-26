import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

import { AuthService, Credential } from '../../shared/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonProviders } from '../../components/components/button-providers.component';

interface SignUpForm {
    email: FormControl<string>;
    password: FormControl<string>;
}

@Component({
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterModule,
        NgIf,
        MatSnackBarModule,
        ButtonProviders,
    ],
    selector: 'app-sign-up',
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css',
    providers: [],
})
export default class SignUpComponent {
    hide = true;

    formBuilder = inject(FormBuilder);

    form: FormGroup<SignUpForm> = this.formBuilder.group({
        email: this.formBuilder.control('', {
            validators: [Validators.required, Validators.email],
            nonNullable: true,
        }),
        password: this.formBuilder.control('', {
            validators: Validators.required,
            nonNullable: true,
        }),
    });

    private authService = inject(AuthService);
    private _router = inject(Router);
    private _snackBar = inject(MatSnackBar);

    get isEmailValid(): string | boolean {
        const control = this.form.get('email');

        const isInvalid = control?.invalid && control.touched;

        if (isInvalid) {
            return control.hasError('required')
                ? 'Este campo es requerido'
                : 'Ingresa un email válido';
        }

        return false;
    }

    async signUp(): Promise<void> {
        if (this.form.invalid) return;

        const credential: Credential = {
            email: this.form.value.email || '',
            password: this.form.value.password || '',
        };

        try {
            await this.authService.signUpWithEmailAndPassword(credential);

            const snackBarRef = this.openSnackBar();

            snackBarRef.afterDismissed().subscribe(() => {
                this._router.navigateByUrl('/username');
            });
        } catch (error) {
            console.error(error);
        }
    }

    openSnackBar() {
        return this._snackBar.open(
            'Registro correcto, Bienvenido al Bingo Gran Buda',
            'Cerrar',
            {
                duration: 2500,
                verticalPosition: 'top',
                horizontalPosition: 'center',
            }
        );
    }
}
