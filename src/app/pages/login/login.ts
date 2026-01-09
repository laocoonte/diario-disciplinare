import { Component } from '@angular/core';
import { effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppwriteService } from '../../appwrite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  providers: [AppwriteService, Router],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loggedInUser: any = null;
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private appwrite: AppwriteService, private router: Router) {
    effect(() => {
      if (this.appwrite.loggedInUser()) {
        this.router.navigate(['/calendar']);
      }
    });
  }

  async login(email: string, password: string) {
    await this.appwrite.login(email, password);
  }

  async logout() {
    await this.appwrite.logout();
  }
}
