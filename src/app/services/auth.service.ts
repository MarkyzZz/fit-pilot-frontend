import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, RegisterCredentials, User } from '../interfaces';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);

    public readonly currentUser = signal<User | null>(null);
    public readonly isLoading = signal(false);
    public readonly csrfReady = signal(false);

    public initCsrf(): void {
        this.http.get<void>(`${environment.apiUrl}/sanctum/csrf-cookie`).subscribe({
            next: () => this.csrfReady.set(true),
            error: () => this.csrfReady.set(true), // allow login attempt even if csrf endpoint fails
        });
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

    public register(credentials: RegisterCredentials): Observable<User> {
        this.isLoading.set(true);

        return this.http.post<User>(`${environment.apiUrl}/api/auth/register`, credentials).pipe(
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
