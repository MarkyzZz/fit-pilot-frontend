import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    InputSignal,
    output,
    OutputEmitterRef,
    ViewEncapsulation,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'fp-header',
    imports: [RouterModule, NgScrollbarModule, TablerIconsModule, MaterialModule],
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
    public readonly showToggle: InputSignal<boolean> = input<boolean>(true);
    public readonly toggleChecked: InputSignal<boolean> = input<boolean>(false);

    public readonly toggleMobileNav: OutputEmitterRef<void> = output<void>();
    public readonly toggleMobileFilterNav: OutputEmitterRef<void> = output<void>();
    public readonly toggleCollapsed: OutputEmitterRef<void> = output<void>();
    public readonly optionsChange: OutputEmitterRef<AppSettings> = output<AppSettings>();

    private readonly authService: AuthService = inject(AuthService);
    private readonly router: Router = inject(Router);

    public logout(): void {
        this.authService
            .logout()
            .pipe(finalize(() => this.router.navigate(['/authentication/login'])))
            .subscribe();
    }
}
