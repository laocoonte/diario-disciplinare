import { Component, Signal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppwriteService } from './appwrite.service';
import { Models } from 'appwrite';
import { NavComponent } from './components/nav/nav';

@Component({
  selector: 'app-root',
  imports: [NavComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('diario-disciplinare');
  protected loggedInUser: Signal<null | Models.User>;

  constructor(public appwrite: AppwriteService) {
    this.loggedInUser = this.appwrite.loggedInUser;
  }

  logout() {
    this.appwrite.logout();
  }
}
