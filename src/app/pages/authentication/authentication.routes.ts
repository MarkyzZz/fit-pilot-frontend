import { Routes } from '@angular/router';
import { noAuthGuard } from '../../guards/no-auth.guard';
import { unverifiedGuard } from '../../guards/unverified.guard';

export const AuthenticationRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                canActivate: [noAuthGuard],
                loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
            },
            {
                path: 'register',
                canActivate: [noAuthGuard],
                loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
            },
            {
                path: 'verify-email/:id/:hash',
                canActivate: [noAuthGuard, unverifiedGuard],
                loadComponent: () =>
                    import('./email-verification/email-verification.component').then(
                        (m) => m.EmailVerificationComponent,
                    ),
            },
            {
                path: 'verify-email-notice',
                canActivate: [unverifiedGuard],
                loadComponent: () =>
                    import('./email-verification-notice/email-verification-notice.component').then(
                        (m) => m.EmailVerificationNoticeComponent,
                    ),
            },
        ],
    },
];
