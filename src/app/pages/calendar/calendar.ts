import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  selectedYear = signal<number>(new Date().getFullYear());
  selectedMonth = signal<number>(new Date().getMonth() + 1);
  daysInMonth = signal<number[]>([]);
  taskService = inject(TaskService);
  tasks = this.taskService.tasks;
  tasksOfTheMonth = signal<any[] | null>(null);

  isTaskLoading = computed(() => this.tasks() == null || this.tasksOfTheMonth == null);
  dataSource = computed(() =>
    this.daysInMonth().map((day) => {
      const tasksForDay =
        this.tasksOfTheMonth()?.filter((task) => {
          const date = new Date(task.day);
          return date.getDate() === day;
        }) || [];
      tasksForDay.sort((a, b) => a.index - b.index);
      return { day, tasks: tasksForDay };
    })
  );

  ngOnInit() {
    this.taskService.getTasks();
    this.changeMonth();
  }

  changeMonth() {
    const now = new Date();
    const month = this.selectedMonth() || now.getMonth();
    const year = this.selectedYear() || now.getFullYear();
    if (this.selectedMonth() == null) {
      this.selectedMonth.set(month);
    }
    if (this.selectedYear() == null) {
      this.selectedYear.set(year);
    }
    const days = new Date(year, month + 1, 0).getDate();
    this.daysInMonth.set(Array.from({ length: days }, (_, i) => i + 1));

    this.taskService.getMonthlyTasks(year, month).then((tasks) => {
      this.tasksOfTheMonth.set(tasks);
    });
  }
}
