import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppModule } from '../main';
import {NavbarComponent} from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [NavbarComponent, AppModule]
})
export class AppComponent {
  title = 'webapp';
}
