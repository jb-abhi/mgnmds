import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-enquiry-form',
  standalone: true,
  templateUrl: './enquiry-form.component.html',
  styleUrl: './enquiry-form.component.css',
})
export class EnquiryFormComponent implements OnDestroy {
  submitting = false;
  status = '';
  toastMessage = '';
  statusIsError = false;
  submitted = false;
  errors: Record<string, string> = {};
  private toastTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  validateField(field: string, value: string): void {
    const trimmed = value.trim();
    let message = '';
    if (field === 'name' && (trimmed.length < 2 || trimmed.length > 100)) {
      message = 'Enter a name between 2 and 100 characters.';
    } else if (field === 'gender' && !['Female', 'Male', 'Other', 'Prefer not to say'].includes(value)) {
      message = 'Select a gender option.';
    } else if (field === 'mobile') {
      const digits = value.replace(/\D/g, '');
      if (!/^[+\d() .-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
        message = 'Enter a valid mobile number with 7 to 15 digits.';
      }
    } else if (field === 'age' && (!/^\d+$/.test(value) || Number(value) < 17 || Number(value) > 80)) {
      message = 'Enter an age from 17 to 80.';
    }
    this.errors[field] = message;
  }

  async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const data = new FormData(formElement);
    this.submitted = true;
    for (const field of ['name', 'gender', 'mobile', 'age']) {
      this.validateField(field, String(data.get(field) ?? ''));
    }
    if (Object.values(this.errors).some(Boolean)) return;

    this.submitting = true;
    this.status = '';
    this.statusIsError = false;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          gender: data.get('gender'),
          mobile: data.get('mobile'),
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
      this.toastMessage = 'Your enquiry was submitted successfully.';
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.toastMessage = '', 4500);
      formElement.reset();
      this.submitted = false;
      this.errors = {};
    } catch (error) {
      this.status = error instanceof Error ? error.message : 'We could not submit your enquiry right now. Please try again later.';
      this.statusIsError = true;
    } finally {
      this.submitting = false;
    }
  }

  validateAfterSubmit(field: string, event: Event): void {
    if (this.submitted) this.validateField(field, (event.target as HTMLInputElement).value);
  }
}
