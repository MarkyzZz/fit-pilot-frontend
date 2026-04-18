import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserStorageService } from 'src/app/services/user-storage.service';
import { VerificationStatus } from 'src/app/types/email-verification';
import { interval, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '@environments/environment';
import { ApiResponse } from 'src/app/types';
import { User } from 'src/app/interfaces';

@Component({
    selector: 'fp-email-verification',
    imports: [MaterialModule],
    templateUrl: './email-verification.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailVerificationComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly userStorage = inject(UserStorageService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly status = signal<VerificationStatus>('loading');
    protected readonly countdown = signal(5);
    protected readonly isSuccess = computed(() => this.status() === 'success');
    protected readonly isError = computed(() => this.status() === 'error');
    protected readonly isLoading = computed(() => this.status() === 'loading');

    public ngOnInit(): void {
        this.startEmailVerification();
    }

    private startEmailVerification(): void {
        const snapshot = this.route.snapshot;
        const id = snapshot.paramMap.get('id') ?? '';
        const hash = snapshot.paramMap.get('hash') ?? '';
        const expires = snapshot.queryParamMap.get('expires') ?? '';
        const signature = snapshot.queryParamMap.get('signature') ?? '';

        if (!id || !hash || !expires || !signature) {
            this.status.set('error');

            return;
        }

        const signedBackendUrl = this.buildEmailVerificationUrl(id, hash, expires, signature);

        this.authService.verifyEmail(signedBackendUrl).subscribe({
            next: (response: ApiResponse<User>) => {
                if (response.data) {
                    this.authService.currentUser.set(response.data);
                    this.userStorage.set(response.data);
                }
                this.status.set('success');
                this.startCountdown();
            },
            error: () => {
                this.status.set('error');
            },
        });
    }

    private buildEmailVerificationUrl(id: string, hash: string, expires: string, signature: string): string {
        return  `${environment.apiUrl}/api/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;
    }

    private startCountdown(): void {
        interval(1000)
            .pipe(
                take(this.countdown()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                const next = this.countdown() - 1;
                this.countdown.set(next);

                if (next === 0) {
                    this.router.navigateByUrl('/dashboard');
                }
            });
    }
}
