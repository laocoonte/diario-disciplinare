import { inject, Injectable, signal } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { environment } from '../../environments/environment';
import { Task } from '../interfaces/task.interface';
import { ID, Query } from 'appwrite';
import { TuiToastService } from '@taiga-ui/kit';
import { DailyTask, DailyTaskStatus } from '../interfaces/daily-task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private appwrite = inject(AppwriteService);
  private toast = inject(TuiToastService);
  tasks = signal<Task[] | null>(null);
  private tableClient = this.appwrite.tableClient;

  private updateTaskOrderTimeout: ReturnType<typeof setTimeout> | null = null;
  private dailyTasksTimeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

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

      this.tasks.set(tasksRes.rows.sort((a, b) => a.index - b.index));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      this.tasks.set(null);
    }
  }

  async getMonthlyTasks(year: number, month: number): Promise<DailyTask[]> {
    try {
      this.userGuard();
      // Calculate the first and last day of the month in ISO format
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      const startISO = start.toISOString().split('T')[0] + 'T00:00:00.000Z';
      const endISO = end.toISOString().split('T')[0] + 'T23:59:59.999Z';
      const tasksRes = await this.tableClient.listRows<DailyTask>({
        databaseId: environment.appwrite.databaseId,
        tableId: 'daily-tasks',
        queries: [Query.greaterThanEqual('day', startISO), Query.lessThanEqual('day', endISO)],
      });

      return tasksRes.rows;
    } catch (error) {
      console.error('Error fetching monthly tasks:', error);
      return [];
    }
  }

  async updateTask(task: UpdateTaskArgs, showToast = true) {
    try {
      this.userGuard();

      const data: Partial<Task> = {
        title: task.title,
        description: task.description,
        active: task.active,
        index: task.index,
      };
      const updated = await this.tableClient.updateRow<Task>({
        databaseId: environment.appwrite.databaseId,
        tableId: 'tasks',
        rowId: task.$id,
        data,
      });

      this.tasks.update((tasks) => tasks!.map((t) => (t.$id === task.$id ? updated : t)));

      if (showToast) {
        this.toast
          .open('Task updated', {
            appearance: 'positive',
          })
          .subscribe();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      if (showToast) {
        this.toast
          .open('Error updating task', {
            appearance: 'negative',
          })
          .subscribe();
      } else {
        throw Error(error instanceof Error ? error.message : String(error));
      }
    }
  }

  // Add this method to update the order of tasks after drag-and-drop
  async updateTaskOrder(tasks: Task[]) {
    if (this.updateTaskOrderTimeout) {
      clearTimeout(this.updateTaskOrderTimeout);
    }
    this.updateTaskOrderTimeout = setTimeout(async () => {
      this.toast.open('Updating task order...', { appearance: 'info' }).subscribe();
      try {
        await Promise.all(tasks.map((task) => this.updateTask(task, false)));
        this.updateTaskOrderTimeout = null;
        this.toast.open('Task order updated', { appearance: 'positive' }).subscribe();
      } catch (error) {
        console.error('Error updating task order:', error);
        this.toast.open('Error updating task order', { appearance: 'negative' }).subscribe();
      }
    }, 2000);
  }

  stopUpdateTaskOrder() {
    if (this.updateTaskOrderTimeout) {
      clearTimeout(this.updateTaskOrderTimeout);
      this.updateTaskOrderTimeout = null;
    }
  }

  private userGuard() {
    const user = this.appwrite.loggedInUser();
    if (!user) {
      throw new Error('User not logged in');
    }
  }

  async createDailyTask(date: string, taskId: string): Promise<[DailyTask | null, unknown]> {
    this.userGuard();
    try {
      const newDaily = await this.tableClient.createRow<DailyTask>({
        databaseId: environment.appwrite.databaseId,
        tableId: 'daily-tasks',
        rowId: ID.unique(),
        data: {
          day: date,
          status: DailyTaskStatus.DONE,
          taskId,
        },
      });
      return [newDaily, null];
    } catch (error) {
      console.error('Error creating daily task:', error);
      this.toast
        .open('Error creating daily task', {
          appearance: 'negative',
        })
        .subscribe();
      return [null, error];
    }
  }

  async updateDailyTaskHandler(dailyTask: DailyTask) {
    this.userGuard();
    if (this.dailyTasksTimeoutMap.has(dailyTask.$id)) {
      clearTimeout(this.dailyTasksTimeoutMap.get(dailyTask.$id));
    }
    this.dailyTasksTimeoutMap.set(
      dailyTask.$id,
      setTimeout(async () => {
        this.updateDailyTask(dailyTask);
      }, 300)
    );
  }

  async updateDailyTask(dailyTask: DailyTask): Promise<[DailyTask | null, unknown]> {
    try {
      const updatedDaily = await this.tableClient.updateRow<DailyTask>({
        databaseId: environment.appwrite.databaseId,
        tableId: 'daily-tasks',
        rowId: dailyTask.$id,
        data: {
          status: dailyTask.status,
        },
      });
      return [updatedDaily, null];
    } catch (error) {
      console.error('Error updating daily task:', error);
      this.toast
        .open('Error updating daily task', {
          appearance: 'negative',
        })
        .subscribe();
      return [null, error];
    }
  }
}

export type UpdateTaskArgs = {
  $id: string;
  title: string;
  description: string;
  active: boolean;
  index: number;
};
