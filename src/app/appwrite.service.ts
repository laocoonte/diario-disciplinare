import { Injectable, signal } from '@angular/core';
import { Client, Account, Models } from 'appwrite';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  public client = new Client();
  public account;
  public loggedInUser = signal<null | Models.User>(null);

  constructor() {
    this.client
      .setEndpoint(environment.appwrite.endpoint)
      .setProject(environment.appwrite.projectId);
    this.account = new Account(this.client);
  }

  public async init(): Promise<void> {
    return this.account
      .get()
      .then((user) => {
        this.loggedInUser.set(user);
      })
      .catch(() => {
        this.loggedInUser.set(null);
      });
  }

  public async login(email: string, password: string) {
    try {
      try {
        await this.account.get();
        if (this.loggedInUser()) {
          await this.logout();
        }
      } catch {
        this.loggedInUser.set(null);
      }

      await this.account.createEmailPasswordSession({
        email,
        password,
      });

      this.loggedInUser.set(await this.account!.get());
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  public async logout() {
    try {
      await this.account.deleteSession({ sessionId: 'current' });
      this.loggedInUser.set(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
