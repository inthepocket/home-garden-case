import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

@Component({
  imports: [AppComponent, RouterModule],
  selector: 'hgc-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'web';
}
