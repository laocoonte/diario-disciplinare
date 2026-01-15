import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task';
@Component({
  selector: 'app-tasks',
  imports: [CommonModule, TaskComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.less',
})
export class Tasks {
  private taskService = inject(TaskService);
  protected tasks = this.taskService.tasks;
  draggedTaskId: string | null = null;

  onDragStart(taskId: string) {
    this.draggedTaskId = taskId;
  }

  onDrop(targetTaskId: string) {
    if (this.draggedTaskId && this.draggedTaskId !== targetTaskId) {
      const tasks = this.tasks()?.slice() || [];
      const fromIndex = tasks.findIndex((t) => t.$id === this.draggedTaskId);
      const toIndex = tasks.findIndex((t) => t.$id === targetTaskId);
      if (fromIndex > -1 && toIndex > -1) {
        const [moved] = tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, moved);
        // Update index property for sorting
        tasks.forEach((t, i) => (t.index = i));
        this.taskService.updateTaskOrder(tasks);
        this.taskService.tasks.set(tasks);
      }
    }
    this.draggedTaskId = null;
  }
}
