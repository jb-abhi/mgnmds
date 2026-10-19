import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/config/site.config';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { EnquiryFormComponent } from '../../shared/components/enquiry-form/enquiry-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IconComponent, EnquiryFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  s = SITE;
  currentSlide = signal(0);
  private slideInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    if (this.s.images.heroSlides.length > 1) {
      this.slideInterval = setInterval(() => {
        this.currentSlide.update((index) => (index + 1) % this.s.images.heroSlides.length);
      }, 5500);
    }
  }

  ngOnDestroy(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }
}
