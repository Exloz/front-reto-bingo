import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

const NO_NG_MODULES = importProvidersFrom([BrowserAnimationsModule]);

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        NO_NG_MODULES,
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'outline',
                color: 'accent',
            },
        },
        importProvidersFrom(
            provideFirebaseApp(() =>
                initializeApp({
                    projectId: 'bingo-auth-9e2bf',
                    appId: '1:430840361794:web:fbfe23d4314c3f0122cedb',
                    storageBucket: 'bingo-auth-9e2bf.appspot.com',
                    apiKey: 'AIzaSyBiqGP6Z0eH9ULdcXqDfgmj2yzNjelvrm8',
                    authDomain: 'bingo-auth-9e2bf.firebaseapp.com',
                    messagingSenderId: '430840361794',
                })
            )
        ),
        importProvidersFrom(provideAuth(() => getAuth())),
    ],
};
