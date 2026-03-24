import { Component, inject, input, computed, effect, signal, model, output } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { TuiTextfield, TuiLabel, TuiIcon, TuiButton } from '@taiga-ui/core';
import { TaskItem } from '../../../interfaces/task.interface';
import { TuiCheckbox, TuiTextarea } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { TUI_IS_MOBILE } from '@taiga-ui/cdk';

@Component({
  selector: 'app-task',
  imports: [
    FormsModule,
    TuiTextarea,
    TuiTextfield,
    TuiLabel,
    TuiIcon,
    TuiButton,
    TuiCheckbox,
  ],
  templateUrl: './task.html',
  styleUrl: './task.less',
})
export class TaskComponent {
  private taskService = inject(TaskService);
  readonly isMobile = inject(TUI_IS_MOBILE);
  size = computed(() => (this.isMobile ? 's' : 'm'));
  iconSize = computed(() => (!this.isMobile ? 1.5 : 1));
  task = input<TaskItem | null>();
  dragStart = output<void>();
  isLoading = signal(false);

  // Signal-based form fields
  title = model<string>('');
  description = model<string>('');
  active = model<boolean>(false);

  // Track if form has been modified
  isDirty = signal(false);

  // Initial values for comparison
  private initialValues = computed(() => ({
    title: this.task()?.title || '',
    description: this.task()?.description || '',
    active: this.task()?.active || false,
  }));

  constructor() {
    // Sync form fields with task input
    effect(() => {
      const taskData = this.task();
      if (taskData) {
        this.title.set(taskData.title || '');
        this.description.set(taskData.description || '');
        this.active.set(taskData.active || false);
        this.isDirty.set(false);
      }
    });

    // Track changes to form fields
    effect(() => {
      const initial = this.initialValues();
      const hasChanges =
        this.title() !== initial.title ||
        this.description() !== initial.description ||
        this.active() !== initial.active;
      this.isDirty.set(hasChanges);
    });
  }

  onDragStart(event: DragEvent) {
    this.dragStart.emit();
    this.taskService.stopUpdateTaskOrder();
  }

  async updateTask() {
    if (!this.task() || this.isLoading()) {
      return;
    }
    this.isLoading.set(true);
    await this.taskService.updateTask({
      $id: this.task()!.$id,
      title: this.title(),
      description: this.description(),
      active: this.active(),
      index: this.task()!.index,
    });
    this.isLoading.set(false);
    this.isDirty.set(false);
  }
}
