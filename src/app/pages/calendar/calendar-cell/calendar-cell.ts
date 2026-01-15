import { Component, computed, effect, input, output, signal } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { DailyTask, DailyTaskStatus } from '../../../interfaces/daily-task.interface';

@Component({
  selector: 'app-calendar-cell',
  templateUrl: './calendar-cell.html',
  imports: [TuiIcon],
  //   styleUrl: './calendar-cell.less',
})
export class CalendarCell {
  // Placeholder for any future logic related to individual calendar cells
  readonly = input<boolean>(false);
  protected DailyTaskStatus = DailyTaskStatus;
  createDaily = output<void>();
  updateDaily = output<DailyTask>();
  task = input<DailyTask | undefined | null>();
  protected taskRef = signal<DailyTask | null>(null);
  protected icon = computed(() => {
    switch (this.task()?.status) {
      case DailyTaskStatus.DONE:
        return 'check';
      case DailyTaskStatus.UNKNOWN:
        return 'circle-question-mark';
      case DailyTaskStatus.MISSED:
        return 'x';
      default:
        return 'minus';
    }
  });

  protected color = computed(() => {
    let color;
    switch (this.task()?.status) {
      case DailyTaskStatus.DONE:
        color = 'var(--tui-text-positive)';
        break;
      case DailyTaskStatus.UNKNOWN:
        color = 'var(--tui-text-tertiary)';
        break;
      case DailyTaskStatus.MISSED:
        color = 'var(--tui-text-negative)';
        break;
      default:
        color = 'var(--tui-text-primary)';
    }
    return color;
  });

  constructor() {
    effect(() => {
      if (this.task() != null) {
        this.taskRef.set(this.task()!);
      }
    });
  }

  changeStatus() {
    if (this.readonly()) {
      return;
    }

    if (this.taskRef()) {
      let newStatus: DailyTaskStatus;
      switch (this.taskRef()?.status) {
        case DailyTaskStatus.UNDONE:
          newStatus = DailyTaskStatus.DONE;
          break;
        case DailyTaskStatus.DONE:
          newStatus = DailyTaskStatus.UNKNOWN;
          break;
        case DailyTaskStatus.UNKNOWN:
          newStatus = DailyTaskStatus.MISSED;
          break;
        case DailyTaskStatus.MISSED:
        default:
          newStatus = DailyTaskStatus.UNDONE;
          break;
      }
      this.taskRef.set({ ...this.taskRef()!, status: newStatus });
      this.updateDaily.emit(this.taskRef()!);
    } else {
      this.createDaily.emit();
    }
  }
}
