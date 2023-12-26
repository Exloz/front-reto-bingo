import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { authGuard } from './shared/guards/auth.guard';
import LoginComponent from './components/login/login.component';
import SignupComponent from './components/signup/signup.component';
import { UserName } from './components/username/username.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'home',
        canActivate: [authGuard],
        component: ChatComponent,
    },
    {
        path: 'username',
        canActivate: [authGuard],
        component: UserName,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
];
