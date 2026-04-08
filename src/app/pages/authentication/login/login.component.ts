import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { LoginForm } from 'src/app/types/login-form.type';

@Component({
    selector: 'fp-login',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly authService = inject(AuthService);

    protected readonly loginImage = signal(
        Math.random() < 0.5 ? '/assets/images/backgrounds/login_1.png' : '/assets/images/backgrounds/login_2.png',
    );

    protected readonly isLoading = this.authService.isLoading;
    protected readonly csrfReady = this.authService.csrfReady;
    protected readonly error = signal<string | null>(null);

    public form: LoginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
    });

    public ngOnInit(): void {
        this.authService.initCsrf();
    }

    public submit(): void {
        if (this.form.invalid) {
            return;
        }

        this.error.set(null);

        this.authService
            .login({
                email: this.form.value.email!,
                password: this.form.value.password!,
            })
            .subscribe({
                next: () => {
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/dashboard';
                    this.router.navigateByUrl(returnUrl);
                },
                error: (err: { error: { message: string } }) => {
                    this.error.set(err.error?.message ?? 'Login failed. Please try again.');
                },
            });
    }
}
