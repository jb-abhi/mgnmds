import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-enquiry-form',
  standalone: true,
  templateUrl: './enquiry-form.component.html',
  styleUrl: './enquiry-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryFormComponent {
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  submitting = false;
  status = '';
  statusIsError = false;
  submitted = false;
  errors: Record<string, string> = {};

  validateField(field: string, value: string): void {
    const trimmed = value.trim();
    let message = '';
    if (field === 'name' && (trimmed.length < 2 || trimmed.length > 100)) {
      message = 'Enter a name between 2 and 100 characters.';
    } else if (field === 'gender' && !['Female', 'Male', 'Other', 'Prefer not to say'].includes(value)) {
      message = 'Select a gender option.';
    } else if (field === 'mobile') {
      if (!/^\d{10}$/.test(value)) {
        message = 'Enter a valid 10-digit mobile number.';
      }
    } else if (field === 'age' && (!/^\d+$/.test(value) || Number(value) < 17 || Number(value) > 80)) {
      message = 'Enter an age from 17 to 80.';
    }
    this.errors[field] = message;
    this.cdr.markForCheck();
  }

  async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const data = new FormData(formElement);
    this.submitted = true;
    for (const field of ['name', 'gender', 'mobile', 'age']) {
      this.validateField(field, String(data.get(field) ?? ''));
    }
    if (Object.values(this.errors).some(Boolean)) {
      this.cdr.markForCheck();
      return;
    }

    this.submitting = true;
    this.status = '';
    this.statusIsError = false;
    this.cdr.markForCheck();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          gender: data.get('gender'),
          mobile: `+91${String(data.get('mobile') ?? '')}`,
          age: Number(data.get('age')),
        }),
      });
      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error('We could not submit your enquiry right now. Please try again later.');
      }
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'We could not submit your enquiry right now. Please try again later.');

      this.status = '';
      this.toast.showSuccess('Your enquiry was submitted successfully. We will be reaching out to you soon.');
      formElement.reset();
      this.submitted = false;
      this.errors = {};
    } catch (error) {
      this.status = error instanceof Error ? error.message : 'We could not submit your enquiry right now. Please try again later.';
      this.statusIsError = true;
      this.toast.showError(this.status);
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }

  validateAfterSubmit(field: string, event: Event): void {
    if (this.submitted) this.validateField(field, (event.target as HTMLInputElement).value);
  }
}
