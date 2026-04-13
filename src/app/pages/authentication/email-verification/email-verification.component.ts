import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { VerificationStatus } from 'src/app/types/email-verification';
import { interval, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
        const id = this.route.snapshot.paramMap.get('id') ?? '';
        const hash = this.route.snapshot.paramMap.get('hash') ?? '';

        if (!id || !hash) {
            this.status.set('error');

            return;
        }

        this.authService.verifyEmail(id, hash).subscribe({
            next: () => {
                this.status.set('success');
                this.startCountdown();
            },
            error: () => {
                this.status.set('error');
            },
        });
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
