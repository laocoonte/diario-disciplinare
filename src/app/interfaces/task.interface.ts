import { Models } from 'appwrite';

export interface TaskItem extends Models.Row {
  title: string;
  description: string;
  index: number;
  active: boolean;
}
