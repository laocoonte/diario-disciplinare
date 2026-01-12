import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  public messages = signal<string[]>([]);

  show(message: string) {
    this.messages.update((msgs) => [...msgs, message]);
    setTimeout(() => this.dismiss(), 3000); // Auto-dismiss after 3s
  }

  dismiss() {
    this.messages.update((msgs) => msgs.slice(1));
  }

  clear() {
    this.messages.set([]);
  }
}
