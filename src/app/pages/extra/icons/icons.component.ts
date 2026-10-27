import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';

@Component({
    selector: 'app-icons',
    imports: [MaterialModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './icons.component.html',
})
export class AppIconsComponent {}
