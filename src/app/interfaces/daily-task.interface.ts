import { Models } from 'appwrite';

export interface Task extends Models.Row {
  day: string; // Format: 'YYYY-MM-DD:hh-mm'
  description: string;
  done: boolean;
  indeterminate: number;
}
