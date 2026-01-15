import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TuiTable, TuiTableControl } from '@taiga-ui/addon-table';
import { CalendarCell } from './calendar-cell/calendar-cell';
import { DailyTask } from '../../interfaces/daily-task.interface';
import { TuiTooltip } from '@taiga-ui/kit';
import { TuiHint, TuiIcon, TuiLoader } from '@taiga-ui/core';
import { CalendarInputs } from './calendar-inputs/calendar-inputs';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    CalendarInputs,
    TuiTooltip,
    TuiIcon,
    TuiLoader,
    TuiTable,
    TuiTableControl,
    CalendarCell,
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.less',
})
export class Calendar {
  readonly = input<boolean>(false);

  selectedYear = signal<number>(new Date().getFullYear());
  selectedMonth = signal<number>(new Date().getMonth() + 1);
  daysInMonth = signal<number[]>([]);
  taskService = inject(TaskService);
  tasks = computed(() => this.taskService.tasks()?.filter((t) => t.active));
  tasksIds = computed(() => this.tasks()?.map((task) => task.$id) || []);
  dailyTasks = signal<DailyTask[] | null>(null);

  isTaskLoading = computed(() => this.tasks() == null || this.dailyTasks() == null);
  dataSource = computed(() =>
    this.daysInMonth().map((day) => {
      const tasksForDay =
        this.dailyTasks()?.filter((task) => {
          const date = new Date(task.day);
          return date.getDate() === day;
        }) || [];
      return {
        day,
        dailies: this.tasksIds().map((id) => tasksForDay?.find((t) => t.taskId === id)),
      };
    })
  );

  ngOnInit() {
    this.taskService.getTasks();
    this.changeMonth();
  }

  private changeMonth() {
    const now = new Date();
    const month = this.selectedMonth() || now.getMonth();
    const year = this.selectedYear() || now.getFullYear();
    if (this.selectedMonth() == null) {
      this.selectedMonth.set(month);
    }
    if (this.selectedYear() == null) {
      this.selectedYear.set(year);
    }
    const days = new Date(year, month, 0).getDate();
    this.daysInMonth.set(Array.from({ length: days }, (_, i) => i + 1));

    this.taskService.getMonthlyTasks(year, month).then((tasks) => {
      this.dailyTasks.set(tasks);
    });
  }

  onMonthChange(month: number) {
    this.selectedMonth.set(month);
    this.changeMonth();
  }

  onYearChange(year: number) {
    this.selectedYear.set(year);
    this.changeMonth();
  }

  async createDailyHandler(day: number, taskIndex: number) {
    const d = new Date(this.selectedYear(), this.selectedMonth() - 1, day);
    const [task, error] = await this.taskService.createDailyTask(
      d.toISOString(),
      this.tasksIds()[taskIndex]
    );
    if (task) {
      this.dailyTasks.update((tasks) => tasks?.concat([task]) || []);
    }
  }

  async updateDailyHandler(updatedTask: DailyTask) {
    const [task, error] = await this.taskService.updateDailyTask(updatedTask);
    if (task) {
      this.dailyTasks.update((tasks) => (tasks || []).map((t) => (t.$id === task.$id ? task : t)));
    }
  }
}
