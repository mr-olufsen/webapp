import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { AppModule } from '../main';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [AppModule, RouterOutlet]
})
export class AppComponent {
  title = 'webapp';
}
