import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

const COOLDOWN_SECONDS = 300;

@Component({
    selector: 'fp-email-verification-notice',
    imports: [MaterialModule],
    templateUrl: './email-verification-notice.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailVerificationNoticeComponent {
    private readonly authService = inject(AuthService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly isSent = signal(false);
    protected readonly cooldownRemaining = signal(0);
    protected readonly errorMessage = signal<string | null>(null);

    protected readonly isDisabled = computed(() => this.isSent() || this.cooldownRemaining() > 0);

    protected resend(): void {
        if (this.isDisabled()) {
            return;
        }

        this.errorMessage.set(null);

        this.authService.resendVerificationEmail().subscribe({
            next: () => {
                this.isSent.set(true);
                this.startCooldown(COOLDOWN_SECONDS);
            },
            error: (err: HttpErrorResponse) => {
                if (err.status === 429) {
                    const retryAfter = Number(err.headers.get('Retry-After')) || COOLDOWN_SECONDS;
                    this.startCooldown(retryAfter);
                } else {
                    this.errorMessage.set('Something went wrong. Please try again later.');
                }
            },
        });
    }

    private startCooldown(seconds: number): void {
        this.cooldownRemaining.set(seconds);

        interval(1000)
            .pipe(take(seconds), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.cooldownRemaining.update((remaining) => remaining - 1);
            });
    }
}
