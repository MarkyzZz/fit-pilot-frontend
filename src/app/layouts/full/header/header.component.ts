import { Component, EventEmitter, inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'fp-header',
    imports: [RouterModule, NgScrollbarModule, TablerIconsModule, MaterialModule],
    templateUrl: './header.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
    @Input() public showToggle = true;
    @Input() public toggleChecked = false;

    @Output() public readonly toggleMobileNav = new EventEmitter<void>();
    @Output() public readonly toggleMobileFilterNav = new EventEmitter<void>();
    @Output() public readonly toggleCollapsed = new EventEmitter<void>();
    @Output() public readonly optionsChange = new EventEmitter<AppSettings>();

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    public logout(): void {
        this.authService.logout().subscribe({
            next: () => this.router.navigate(['/authentication/login']),
        });
    }
}
