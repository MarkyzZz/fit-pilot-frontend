import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces';

export const unverifiedGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user: User | null = authService.currentUser();

    if (user?.verified) {
        return router.createUrlTree(['/dashboard']);
    }

    return true;
};
