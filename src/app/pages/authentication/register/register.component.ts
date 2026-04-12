import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterForm } from 'src/app/types';

const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmation = group.get('password_confirmation')?.value;
    return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
};

@Component({
    selector: 'fp-register',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
    templateUrl: './register.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    protected readonly isLoading = this.authService.isLoading;
    protected readonly csrfReady = this.authService.csrfReady;
    protected readonly error = signal<string | null>(null);

    public form: RegisterForm = new FormGroup(
        {
            first_name: new FormControl('', [Validators.required]),
            last_name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)]),
            password_confirmation: new FormControl('', [Validators.required]),
        },
        { validators: passwordMatchValidator },
    );

    public ngOnInit(): void {
        this.authService.initCsrf();
    }

    public submit(): void {
        if (this.form.invalid) {
            return;
        }

        this.error.set(null);

        this.authService
            .register({
                first_name: this.form.value.first_name || '',
                last_name: this.form.value.last_name || '',
                email: this.form.value.email || '',
                password: this.form.value.password || '',
                password_confirmation: this.form.value.password_confirmation || '',
            })
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/dashboard');
                },
                error: (err: { error: { message: string } }) => {
                    this.error.set(err.error?.message ?? 'Registration failed. Please try again.');
                },
            });
    }
}
