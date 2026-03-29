import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

@Component({
    selector: 'fp-login',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class LoginComponent {
    private router: Router = inject(Router);

    public readonly loginImage = signal(
        Math.random() < 0.5 ? '/assets/images/backgrounds/login_1.png' : '/assets/images/backgrounds/login_2.png',
    );

    public form = new FormGroup({
        uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
        password: new FormControl('', [Validators.required]),
    });

    public submit(): void {
        this.router.navigate(['']);
    }
}
