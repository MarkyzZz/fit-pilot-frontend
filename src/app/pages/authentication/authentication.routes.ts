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
                path: 'verify-email/:id/:hash',
                loadComponent: () =>
                    import('./email-verification/email-verification.component').then(
                        (m) => m.EmailVerificationComponent,
                    ),
            },
            {
                path: 'verify-email-notice',
                loadComponent: () =>
                    import('./email-verification-notice/email-verification-notice.component').then(
                        (m) => m.EmailVerificationNoticeComponent,
                    ),
            },
        ],
    },
];
