import { Models } from 'appwrite';

export interface DailyTask extends Models.Row {
  day: string; // Format: 'YYYY-MM-DD:hh-mm'
  status: DailyTaskStatus;
  taskId: string;
}

export enum DailyTaskStatus {
  UNDONE = 'undone',
  UNKNOWN = 'unknown',
  DONE = 'done',
  MISSED = 'missed',
}
