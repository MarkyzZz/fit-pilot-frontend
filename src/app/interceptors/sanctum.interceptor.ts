import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { inject } from '@angular/core';
import { UserStorageService } from 'src/app/services/user-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

export function sanctumInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const userStorage = inject(UserStorageService);
    const authService = inject(AuthService);
    const router: Router = inject(Router);

    if (!request.url.startsWith(environment.apiUrl)) {
        return next(request);
    }

    const headers: Record<string, string> = { Accept: 'application/json' };
    const xsrfTokenPattern = /(?:^|;)\s*XSRF-TOKEN=([^;]+)/;
    const match = document.cookie.match(xsrfTokenPattern);

    const xsrfToken = match ? decodeURIComponent(match[1]) : null;

    if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    return next(
        request.clone({
            setHeaders: headers,
            withCredentials: true,
        }),
    ).pipe(
        catchError((error: unknown) => {
            if (
                error instanceof HttpErrorResponse &&
                error.status === HttpStatusCode.Unauthorized &&
                !request.url.includes('sanctum/csrf-cookie')
            ) {
                authService.currentUser.set(null);
                userStorage.clear();

                router.navigateByUrl('/authentication/login');

                return throwError(() => error);
            }

            return throwError(() => error);
        }),
    );
}
