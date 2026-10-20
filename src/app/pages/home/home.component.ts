import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
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
  youtubeVideos: { title: string; embedUrl: SafeResourceUrl }[];
  @ViewChild('imageViewer') private imageViewer?: ElementRef<HTMLDialogElement>;
  selectedImage = signal<(typeof SITE.gallery)[number] | null>(null);
  aboutImageLoaded = signal(false);
  mosaicTiles = Array.from({ length: 36 }, (_, index) => ({
    id: index,
    delay: ((index * 13) % 36) * 30,
  }));
  private slideInterval?: ReturnType<typeof setInterval>;

  constructor(sanitizer: DomSanitizer) {
    this.mapEmbedUrl = sanitizer.bypassSecurityTrustResourceUrl(SITE.mapsEmbedUrl);
    this.youtubeVideos = SITE.youtubeVideos.flatMap(({ title, url }) => {
      const videoId = this.getYouTubeVideoId(url);
      return videoId
        ? [{ title, embedUrl: sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${videoId}`) }]
        : [];
    });
  }

  private getYouTubeVideoId(value: string): string | null {
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
      if (host === 'youtu.be') {
        const id = url.pathname.split('/').filter(Boolean)[0];
        return id && /^[\w-]{11}$/.test(id) ? id : null;
      }
      if (host !== 'youtube.com') return null;

      const parts = url.pathname.split('/').filter(Boolean);
      const id = url.pathname === '/watch'
        ? url.searchParams.get('v')
        : ['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : null;
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    } catch {
      return null;
    }
  }

  ngOnInit(): void {
    if (this.s.images.heroSlides.length > 1) {
      this.slideInterval = setInterval(() => {
        this.currentSlide.update((index) => (index + 1) % this.s.images.heroSlides.length);
      }, 5500);
    }
  }

  openImage(image: (typeof SITE.gallery)[number]): void {
    this.selectedImage.set(image);
    this.imageViewer?.nativeElement.showModal();
  }

  closeImage(): void {
    this.imageViewer?.nativeElement.close();
    this.selectedImage.set(null);
  }

  ngOnDestroy(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }
}
