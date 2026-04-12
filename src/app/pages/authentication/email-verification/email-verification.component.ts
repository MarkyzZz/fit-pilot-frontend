import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { VerificationStatus } from 'src/app/types/email-verification';

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
        const interval = setInterval(() => {
            const next = this.countdown() - 1;
            this.countdown.set(next);
            if (next === 0) {
                clearInterval(interval);
                this.router.navigateByUrl('/dashboard');
            }
        }, 1000);
    }
}
