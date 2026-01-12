import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';
import { NavComponent } from './components/nav/nav';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [ToastComponent, NavComponent, RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('diario-disciplinare');
  protected appwrite = inject(AppwriteService);
  protected loggedUser = computed(() => this.appwrite.loggedInUser());

  logout() {
    this.appwrite.logout(true);
  }
}
