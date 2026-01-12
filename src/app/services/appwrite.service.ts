import { inject, Injectable, signal } from '@angular/core';
import { Client, Account, Models, TablesDB } from 'appwrite';
import { environment } from '../../environments/environment';
import { ToastService } from '../components/toast/toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  public ID = Math.random().toString(36).substring(2, 10);
  public client = new Client();
  public account: Account;
  public tableClient: TablesDB;
  public readonly loggedInUser = signal<null | Models.User>(null);

  private toastService = inject(ToastService);
  private router = inject(Router);
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
      this.toastService.show('Login failed: ' + error);
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
