import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';

@Component({
    selector: 'app-sample-page',
    imports: [MaterialModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './sample-page.component.html',
})
export class AppSamplePageComponent {}
