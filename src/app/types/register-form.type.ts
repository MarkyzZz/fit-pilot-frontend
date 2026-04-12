import { FormControl, FormGroup } from '@angular/forms';

export type RegisterForm = FormGroup<{
    first_name: FormControl<string>;
    last_name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    password_confirmation: FormControl<string>;
}>;
