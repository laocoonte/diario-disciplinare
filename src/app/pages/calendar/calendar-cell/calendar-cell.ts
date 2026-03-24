import { Component, computed, input, output, signal } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { DailyTask, DailyTaskStatus } from '../../../interfaces/daily-task.interface';

const STATUS_CYCLE: Record<string, DailyTaskStatus> = {
  [DailyTaskStatus.UNDONE]: DailyTaskStatus.DONE,
  [DailyTaskStatus.DONE]: DailyTaskStatus.UNKNOWN,
  [DailyTaskStatus.UNKNOWN]: DailyTaskStatus.MISSED,
  [DailyTaskStatus.MISSED]: DailyTaskStatus.UNDONE,
};

const ICON_MAP: Record<string, string> = {
  [DailyTaskStatus.DONE]: 'check',
  [DailyTaskStatus.UNKNOWN]: 'circle-question-mark',
  [DailyTaskStatus.MISSED]: 'x',
};

const COLOR_MAP: Record<string, string> = {
  [DailyTaskStatus.DONE]: 'var(--tui-text-positive)',
  [DailyTaskStatus.UNKNOWN]: 'var(--tui-text-tertiary)',
  [DailyTaskStatus.MISSED]: 'var(--tui-text-negative)',
};

@Component({
  selector: 'app-calendar-cell',
  templateUrl: './calendar-cell.html',
  imports: [TuiIcon],
})
export class CalendarCell {
  readonly = input(false);
  createDaily = output<void>();
  updateDaily = output<DailyTask>();
  task = input<DailyTask | undefined | null>();

  private localStatus = signal<DailyTaskStatus | null>(null);

  protected currentStatus = computed(
    () => this.localStatus() ?? this.task()?.status ?? null
  );
  protected icon = computed(() => ICON_MAP[this.currentStatus()!] ?? 'minus');
  protected color = computed(() => COLOR_MAP[this.currentStatus()!] ?? 'var(--tui-text-primary)');

  changeStatus() {
    if (this.readonly()) return;

    const current = this.task();
    if (current) {
      const newStatus = STATUS_CYCLE[this.currentStatus()!] ?? DailyTaskStatus.UNDONE;
      this.localStatus.set(newStatus);
      this.updateDaily.emit({ ...current, status: newStatus });
    } else {
      this.createDaily.emit();
    }
  }
}
