import { TuiButton, TuiRoot } from '@taiga-ui/core';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';
import { NavComponent } from './components/nav/nav';
import { TuiAppBar } from '@taiga-ui/layout';

@Component({
  selector: 'app-root',
  imports: [TuiAppBar, TuiButton, NavComponent, RouterOutlet, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected readonly title = signal('diario-disciplinare');
  protected appwrite = inject(AppwriteService);
  protected darkTheme = signal(false);
  protected loggedUser = computed(() => this.appwrite.loggedInUser());

  ngOnInit() {
    // Check OS theme preference on app load
    const theme = localStorage.getItem('theme');
    if (!theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkTheme.set(prefersDark);
    } else {
      this.darkTheme.set(theme === 'dark');
    }
  }

  setTheme(theme: 'dark' | 'light') {
    localStorage.setItem('theme', theme);
    this.darkTheme.set(theme === 'dark');
  }

  logout() {
    this.appwrite.logout(true);
  }
}
