import { Injectable, OnDestroy, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService implements OnDestroy {
  readonly message = signal('');
  readonly isError = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  showSuccess(message: string): void {
    this.show(message, false);
  }

  showError(message: string): void {
    this.show(message, true);
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  private show(message: string, isError: boolean): void {
    this.message.set(message);
    this.isError.set(isError);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.message.set(''), 5000);
  }
}
