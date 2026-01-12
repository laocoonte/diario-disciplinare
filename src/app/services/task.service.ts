import { inject, Injectable, signal } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { environment } from '../../environments/environment';
import { Task } from '../interfaces/task.interface';
import { Query } from 'appwrite';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  appwrite = inject(AppwriteService);
  tasks = signal<Task[] | null>(null);
  tableClient = this.appwrite.tableClient;

  constructor() {
    this.init();
  }

  init() {
    this.getTasks();
  }

  async getTasks() {
    try {
      this.userGuard();
      const tasksRes = await this.tableClient.listRows<Task>({
        databaseId: environment.appwrite.databaseId,
        tableId: 'tasks',
      });

      this.tasks.set(tasksRes.rows);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      this.tasks.set(null);
    }
  }

  async getMonthlyTasks(year: number, month: number): Promise<Task[]> {
    try {
      this.userGuard();
      const tasksRes = await this.tableClient.listRows<Task>({
        databaseId: environment.appwrite.databaseId,
        tableId: 'daily-tasks',
        queries: [
          Query.greaterThan('day', `${year}-${String(month).padStart(2, '0')}-00`),
          Query.lessThan('day', `${year}-${String(month).padStart(2, '0')}-32`),
        ],
      });

      return tasksRes.rows;
    } catch (error) {
      console.error('Error fetching monthly tasks:', error);
      return [];
    }
  }

  private userGuard() {
    const user = this.appwrite.loggedInUser();
    if (!user) {
      throw new Error('User not logged in');
    }
  }
}
