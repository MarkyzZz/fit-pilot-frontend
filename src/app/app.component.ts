import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'fp-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
})
export class AppComponent {
    protected title = 'Fitpilot Fitness Tracking';
}
