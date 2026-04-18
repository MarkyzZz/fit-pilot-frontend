import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { LoginCredentials, User } from '../interfaces';
import { environment } from '@environments/environment';
import { ApiResponse, RegisterCredentials } from '../types';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);

    public readonly currentUser = signal<User | null>(null);
    public readonly isLoading = signal(false);
    public readonly csrfReady = signal(false);
    public readonly isEmailVerified = computed(() => {
        const user: User|null = this.currentUser();

        return user !== null && user.verified;
    });

    public initCsrf(): void {
        this.http.get<void>(`${environment.apiUrl}/sanctum/csrf-cookie`).subscribe({
            next: () => this.csrfReady.set(true),
            error: () => this.csrfReady.set(true), // allow login attempt even if csrf endpoint fails
        });
    }

    public login(credentials: LoginCredentials): Observable<ApiResponse<User>> {
        this.isLoading.set(true);

        return this.http.post<ApiResponse<User>>(`${environment.apiUrl}/api/auth/login`, credentials).pipe(
            tap((apiResponse: ApiResponse<User>) => this.currentUser.set(apiResponse.data!)),
            finalize(() => this.isLoading.set(false)),
        );
    }

    public register(credentials: RegisterCredentials): Observable<{ message: string }> {
        this.isLoading.set(true);

        return this.http
            .post<{ message: string }>(`${environment.apiUrl}/api/auth/register`, credentials)
            .pipe(finalize(() => this.isLoading.set(false)));
    }

    public logout(): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/api/auth/logout`, {}).pipe(
            tap(() => {
                this.currentUser.set(null);
            }),
        );
    }

    public verifyEmail(signedBackendUrl: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(signedBackendUrl);
    }

    public resendVerificationEmail(): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${environment.apiUrl}/api/auth/email/resend`, {});
    }
}
