import { FormControl, FormGroup } from '@angular/forms';

export type RegisterForm = FormGroup<{
    first_name: FormControl<string | null>;
    last_name: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    password_confirmation: FormControl<string | null>;
}>;
