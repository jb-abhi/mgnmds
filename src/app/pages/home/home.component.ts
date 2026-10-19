import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/config/site.config';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { EnquiryFormComponent } from '../../shared/components/enquiry-form/enquiry-form.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IconComponent, EnquiryFormComponent, RevealOnScrollDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  s = SITE;
  mapEmbedUrl: SafeResourceUrl;
  mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name}, ${SITE.address}`)}`;
  currentSlide = signal(0);
  private slideInterval?: ReturnType<typeof setInterval>;

  constructor(sanitizer: DomSanitizer) {
    this.mapEmbedUrl = sanitizer.bypassSecurityTrustResourceUrl(SITE.mapsEmbedUrl);
  }

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
