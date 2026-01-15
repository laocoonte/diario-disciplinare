import { Models } from 'appwrite';

export interface Task extends Models.Row {
  title: string;
  description: string;
  index: number;
  active: boolean;
}
