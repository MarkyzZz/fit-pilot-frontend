import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { VerificationStatus } from 'src/app/types/email-verification';
import { interval, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '@environments/environment';

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
        const encodedUrl = this.route.snapshot.queryParamMap.get('url');

        if (!encodedUrl) {
            this.status.set('error');

            return;
        }

        const signedBackendUrl = decodeURIComponent(encodedUrl);

        if (!this.isTrustedUrl(signedBackendUrl)) {
            this.status.set('error');

            return;
        }

        this.authService.verifyEmail(signedBackendUrl).subscribe({
            next: () => {
                this.status.set('success');
                this.startCountdown();
            },
            error: () => {
                this.status.set('error');
            },
        });
    }

    private isTrustedUrl(url: string): boolean {
        try {
            const parsed = new URL(url);
            const trusted = new URL(environment.apiUrl);

            return parsed.origin === trusted.origin;
        } catch {
            return false;
        }
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
