import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { authGuard } from './shared/guards/auth.guard';
import LoginComponent from './components/login/login.component';
import SignupComponent from './components/signup/signup.component';

export const routes: Routes = [
    {
        path: 'home',
        canActivate: [authGuard],
        component: ChatComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
    // {
    //     // path: 'home/:gameSetId',
    //     path: 'home',
    //     component: ChatComponent,
    //     canActivate: [authGuard],
    // },
];
