import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AuthenticationRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'register',
                component: RegisterComponent,
            },
            {
                path: 'email/verify/:id/:hash',
                loadComponent: () =>
                    import('./email-verification/email-verification.component').then(
                        (m) => m.EmailVerificationComponent,
                    ),
            },
        ],
    },
];
