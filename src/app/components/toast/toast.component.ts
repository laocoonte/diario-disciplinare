import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (msg of messages(); track msg) {
      <div class="toast">
        {{ msg }}
      </div>
      }
    </div>
  `,
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  messages = computed(() => this.toastService.messages());
  constructor(public toastService: ToastService) {}
}
