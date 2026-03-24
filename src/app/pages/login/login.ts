import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppwriteService } from '../../services/appwrite.service';
import { Router } from '@angular/router';
import { TuiButton, TuiLabel, TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-login',
  imports: [FormsModule, TuiTextfield, TuiLabel, TuiButton],
  templateUrl: './login.html',
  styleUrl: './login.less',
})
export class Login {
  protected email = '';
  protected password = '';
  private appwrite = inject(AppwriteService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.appwrite.loggedInUser()) {
        this.router.navigate(['/calendar']);
      }
    });
  }

  async login(email: string, password: string) {
    await this.appwrite.login(email, password);
  }
}
