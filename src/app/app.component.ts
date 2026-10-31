import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'fp-root',
    imports: [RouterOutlet],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './app.component.html',
})
export class AppComponent {
    protected title = 'Modernize Angular Admin Template';
}
