import { FormControl, FormGroup } from '@angular/forms';

export type LoginForm = FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}>;
