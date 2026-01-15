import { Component, computed, inject } from '@angular/core';
import { effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppwriteService } from '../../services/appwrite.service';
import { Router } from '@angular/router';
import { TuiButton, TuiLabel, TuiTextfield, TuiTitle } from '@taiga-ui/core';

@Component({
  selector: 'app-login',
  imports: [FormsModule, TuiTextfield, TuiLabel, TuiButton],
  templateUrl: './login.html',
  styleUrl: './login.less',
})
export class Login {
  email: string = '';
  password: string = '';
  name: string = '';
  protected appwrite = inject(AppwriteService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!!this.appwrite.loggedInUser()) {
        this.router.navigate(['/calendar']);
      }
    });
  }

  async login(email: string, password: string) {
    await this.appwrite.login(email, password);
    if (!!this.appwrite.loggedInUser()) {
      this.router.navigate(['/calendar']);
    }
  }

  async logout() {
    await this.appwrite.logout();
  }
}
