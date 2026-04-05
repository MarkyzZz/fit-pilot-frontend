import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginCredentials } from '../interfaces/login-credentials.interface';
import { User } from '../interfaces/user.interface';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);

    public readonly currentUser = signal<User | null>(null);
    public readonly isLoading = signal(false);

    public initCsrf(): Observable<void> {
        return this.http.get<void>(`${environment.apiUrl}/sanctum/csrf-cookie`);
    }

    public login(credentials: LoginCredentials): Observable<User> {
        this.isLoading.set(true);
        return this.http.post<User>(`${environment.apiUrl}/api/auth/login`, credentials).pipe(
            tap({
                next: (user) => {
                    this.currentUser.set(user);
                    this.isLoading.set(false);
                },
                error: () => {
                    this.isLoading.set(false);
                },
            }),
        );
    }

    public logout(): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/api/auth/logout`, {}).pipe(
            tap(() => {
                this.currentUser.set(null);
            }),
        );
    }
}
