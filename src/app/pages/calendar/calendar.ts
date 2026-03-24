import { Component, computed, inject, input, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TuiTable, TuiTableControl } from '@taiga-ui/addon-table';
import { CalendarCell } from './calendar-cell/calendar-cell';
import { DailyTask } from '../../interfaces/daily-task.interface';
import { TuiTooltip } from '@taiga-ui/kit';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';
import { CalendarInputs } from './calendar-inputs/calendar-inputs';

@Component({
  selector: 'app-calendar',
  imports: [
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

  protected selectedYear = signal(new Date().getFullYear());
  protected selectedMonth = signal(new Date().getMonth() + 1);
  protected daysInMonth = signal<number[]>([]);
  private taskService = inject(TaskService);
  protected tasks = computed(() => this.taskService.tasks()?.filter((t) => t.active));
  protected tasksIds = computed(() => this.tasks()?.map((task) => task.$id) || []);
  protected dailyTasks = signal<DailyTask[] | null>(null);

  protected isTaskLoading = computed(() => this.tasks() == null || this.dailyTasks() == null);
  protected dataSource = computed(() =>
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
    const month = this.selectedMonth();
    const year = this.selectedYear();
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
