import { inject, Injectable, signal } from '@angular/core';
import { Client, Account, Models, TablesDB } from 'appwrite';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { TuiToastService } from '@taiga-ui/kit';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  public client = new Client();
  public account: Account;
  public tableClient: TablesDB;
  public readonly loggedInUser = signal<null | Models.User>(null);

  private router = inject(Router);
  private toast = inject(TuiToastService);
  constructor() {
    this.client
      .setEndpoint(environment.appwrite.endpoint)
      .setProject(environment.appwrite.projectId);
    this.account = new Account(this.client);
    this.tableClient = new TablesDB(this.client);
    this.init();
  }

  public async init(): Promise<void> {
    try {
      const user = await this.account.get();
      this.updateLoggedInUser(user);
    } catch {
      this.updateLoggedInUser(null);
    }
  }

  public async login(email: string, password: string) {
    try {
      // Always logout first to clear any stale session
      await this.logout(false); // Don't navigate on logout here
      await this.account.createEmailPasswordSession({
        email,
        password,
      });

      const user = await this.account.get();
      this.loggedInUser.set(user);
    } catch (error) {
      this.updateLoggedInUser(null);
      this.toast
        .open('Login failed: ' + error, {
          appearance: 'negative',
        })
        .subscribe();
    }
  }

  public async logout(navigate: boolean = true) {
    try {
      await this.account.deleteSession({ sessionId: 'current' });
      this.updateLoggedInUser(null);
      if (navigate) {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      // Ignore errors if no session exists
    }
  }

  private updateLoggedInUser(user: Models.User | null) {
    this.loggedInUser.set(user);
  }
}
