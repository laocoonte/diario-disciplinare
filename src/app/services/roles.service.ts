import { computed, Injectable, signal } from '@angular/core';
import { Client, TablesDB, Query } from 'appwrite';
import { environment } from '../../environments/environment';
import { AppRole } from '../interfaces/app-role.interface';
import { UserRole } from '../interfaces/user-role.interface';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private client = new Client()
    .setEndpoint(environment.appwrite.endpoint)
    .setProject(environment.appwrite.projectId);
  private tableClient = new TablesDB(this.client);

  constructor() {
    this.getRoles();
  }

  private roles = signal<AppRole[] | null>(null);
  public userRoles = signal<UserRole[] | null>(null);
  public computedRoles = computed(() => {
    return this.userRoles()?.map(ur => {
        const role = this.roles()?.find(r => r.$id === ur.roleId);
        return role ? ({...ur, name: role.name}) : null;
    }).filter(r => r !== null) as (UserRole & { name: string })[] | null;
  });

  async getRoles() {
    try {
      const rolesRes = await this.tableClient.listRows<AppRole>({
        databaseId: environment.appwrite.databaseId,
        tableId: 'roles',
      });
      this.roles.set(rolesRes.rows);
    } catch (error) {
      console.error('Error fetching roles:', error);
      this.roles.set(null);
    }
  }

  async getUserRoles(userId: string) {
    try {
      const rolesRes = await this.tableClient.listRows<UserRole>({
        databaseId: environment.appwrite.databaseId,
        tableId: 'user-roles',
        queries: [Query.equal('userId', userId)],
      });
      this.userRoles.set(rolesRes.rows);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      this.userRoles.set(null);
    }
  }

  public clean() {
    this.userRoles.set(null);
  }
}
