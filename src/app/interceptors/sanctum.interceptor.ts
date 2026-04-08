import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export function sanctumInterceptor(
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
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
    );
}
