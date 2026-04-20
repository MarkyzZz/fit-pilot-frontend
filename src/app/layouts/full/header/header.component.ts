import { Component, EventEmitter, inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-header',
    imports: [RouterModule, NgScrollbarModule, TablerIconsModule, MaterialModule],
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
    @Input() showToggle = true;
    @Input() toggleChecked = false;
    @Output() toggleMobileNav = new EventEmitter<void>();
    @Output() toggleMobileFilterNav = new EventEmitter<void>();
    @Output() toggleCollapsed = new EventEmitter<void>();
    showFiller = false;
    @Output() optionsChange = new EventEmitter<AppSettings>();
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    public logout(): void {
        this.authService
            .logout()
            .pipe(finalize(() => this.router.navigate(['/authentication/login'])))
            .subscribe();
    }
}
