import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmation = group.get('password_confirmation')?.value;

    return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
};
