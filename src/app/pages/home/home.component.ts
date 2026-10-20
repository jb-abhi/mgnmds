import { Component, ElementRef, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SITE, ReviewItem } from '../../core/config/site.config';
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
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(SITE.mapsEmbedUrl);
  mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name}, ${SITE.address}`)}`;
  currentSlide = signal(0);
  youtubeVideos = signal<{ title: string; embedUrl: SafeResourceUrl; videoId: string }[]>(this.initYoutubeVideos());
  homeVideos = signal<{ title: string; embedUrl: SafeResourceUrl; videoId: string }[]>(this.initYoutubeVideos().slice(0, 4));
  homeGallery = SITE.gallery.slice(0, 5);
  @ViewChild('imageViewer') private imageViewer?: ElementRef<HTMLDialogElement>;
  selectedImage = signal<(typeof SITE.gallery)[number] | null>(null);
  aboutImageLoaded = signal(false);
  mosaicTiles = Array.from({ length: 36 }, (_, index) => ({
    id: index,
    delay: ((index * 13) % 36) * 30,
  }));
  private slideInterval?: ReturnType<typeof setInterval>;

  reviews = signal<ReviewItem[]>(this.initReviews());
  googleRating = signal(SITE.googleRating ?? 4.8);
  loadingReviews = signal(true);
  googleReviewCount = signal(SITE.googleReviewCount ?? 9);
  googleReviewWriteUrl = SITE.googleReviewWriteUrl;

  private initReviews(): ReviewItem[] {
    const googleList = (SITE.googleReviews || []).map((r) => ({
      ...r,
      rating: r.rating ?? 5,
      source: 'google' as const,
    }));
    const customList = (SITE.testimonials || []).map((t) => ({
      ...t,
      rating: t.rating ?? 5,
      source: 'custom' as const,
    }));

    // Filter strictly for 4 stars and above
    return [...googleList, ...customList].filter((r) => (r.rating ?? 5) >= 4);
  }

  async fetchLiveGoogleReviews(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.loadingReviews.set(false);
      return;
    }

    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = (await res.json()) as {
          configured?: boolean;
          rating?: number;
          totalReviews?: number;
          reviews?: ReviewItem[];
        };
        if (data.configured && Array.isArray(data.reviews)) {
          this.applyReviews(data.reviews, data.rating, data.totalReviews);
        }
      }
    } catch {
      // Keep the configured local testimonials if the Pages Function is unavailable.
    }
    this.loadingReviews.set(false);
  }

  private applyReviews(googleReviews: ReviewItem[], rating?: number, total?: number): void {
    if (rating) this.googleRating.set(rating);
    if (total) this.googleReviewCount.set(total);

    const validGoogle = googleReviews.filter((r) => (r.rating ?? 5) >= 4);
    const customList = (SITE.testimonials || []).filter((t) => (t.rating ?? 5) >= 4);
    this.reviews.set([...validGoogle, ...customList]);
  }

  private initYoutubeVideos(): { title: string; embedUrl: SafeResourceUrl; videoId: string }[] {
    return SITE.youtubeVideos.flatMap(({ title, url }) => {
      const videoId = this.getYouTubeVideoId(url);
      return videoId
        ? [{ title, embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${videoId}`), videoId }]
        : [];
    });
  }

  async fetchLiveYouTubeVideos(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const res = await fetch('/api/youtube');
      if (!res.ok) return;
      const data = (await res.json()) as {
        videos?: Array<{ title: string; url: string; videoId: string }>;
      };
      if (Array.isArray(data.videos) && data.videos.length > 0) {
        const currentList = this.youtubeVideos();
        const existingIds = new Set(currentList.map((v) => v.videoId));
        const newItems: { title: string; embedUrl: SafeResourceUrl; videoId: string }[] = [];

        for (const item of data.videos) {
          if (!item.videoId || existingIds.has(item.videoId)) continue;
          existingIds.add(item.videoId);
          newItems.push({
            title: item.title,
            embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${item.videoId}`),
            videoId: item.videoId,
          });
        }

        if (newItems.length > 0) {
          const merged = [...currentList, ...newItems];
          this.youtubeVideos.set(merged);
          this.homeVideos.set(merged.slice(0, 4));
        }
      }
    } catch {
      // Endpoint unreachable in local dev without proxy or offline
    }
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
    void this.fetchLiveGoogleReviews();
    void this.fetchLiveYouTubeVideos();
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
