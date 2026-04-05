import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment';

export const sanctumInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.url.startsWith(environment.apiUrl)) {
        return next(req);
    }

    return next(
        req.clone({
            setHeaders: {
                Accept: 'application/json',
            },
            withCredentials: true,
        }),
    );
};
