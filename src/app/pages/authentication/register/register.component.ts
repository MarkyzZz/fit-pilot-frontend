import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatPrefix, MatSuffix } from '@angular/material/form-field';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterForm } from 'src/app/types';
import { passwordMatchValidator } from 'src/app/validators';

@Component({
    selector: 'fp-register',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, MatSuffix, TablerIconsModule],
    templateUrl: './register.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);

    protected readonly isLoading = this.authService.isLoading;
    protected readonly csrfReady = this.authService.csrfReady;
    protected readonly error = signal<string | null>(null);
    protected readonly showPassword = signal(false);
    protected readonly showPasswordConfirmation = signal(false);
    protected readonly registrationSuccess = signal(false);

    protected form: RegisterForm = new FormGroup(
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

    protected submit(): void {
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
                    this.registrationSuccess.set(true);
                },
                error: (err: { error: { message: string } }) => {
                    this.error.set(err.error?.message ?? 'Registration failed. Please try again.');
                },
            });
    }
}
