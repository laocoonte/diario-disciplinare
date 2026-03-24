import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppwriteService } from '../../services/appwrite.service';
import { Router } from '@angular/router';
import { TuiButton, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { RolesService } from '../../services/roles.service';

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
  private rolesService = inject(RolesService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      const user = this.appwrite.loggedInUser();
      const userRoles = this.rolesService.userRoles() != null;
      if (user && userRoles) {
        if (this.rolesService.computedRoles()?.some(role => role?.name === 'Observer')) {
          this.router.navigate(['/', 'observe']);
        } else {
          this.router.navigate(['/', 'calendar']);
        }
      }
    });
  }

  async login(email: string, password: string) {
    await this.appwrite.login(email, password);
  }
}
