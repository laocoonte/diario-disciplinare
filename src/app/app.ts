import { TuiButton, TuiRoot, TuiHintDirective } from '@taiga-ui/core';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';
import { NavComponent } from './components/nav/nav';
import { TuiAppBar } from '@taiga-ui/layout';
import { TUI_IS_MOBILE } from '@taiga-ui/cdk';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'app-root',
  imports: [TuiAppBar, TuiAvatar, TuiHintDirective, TuiButton, NavComponent, RouterOutlet, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected appwrite = inject(AppwriteService);
  protected darkTheme = signal(false);
  public readonly isMobile = inject(TUI_IS_MOBILE);

  constructor() {
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
