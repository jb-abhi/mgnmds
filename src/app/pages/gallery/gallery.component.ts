import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SITE, GalleryImage, GalleryVideo, CollageSpan } from '../../core/config/site.config';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

export interface ProcessedPhoto {
  src: string;
  alt: string;
  caption: string;
  span: CollageSpan;
  hasExplicitSpan: boolean;
}

export interface ProcessedVideo {
  title: string;
  url: string;
  caption?: string;
  videoId: string;
  thumbnailUrl: string;
  watchUrl: string;
  embedUrl: SafeResourceUrl;
  span: CollageSpan;
  isShort: boolean;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RevealOnScrollDirective, IconComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  s = SITE;

  @ViewChild('imageViewer') private imageViewer?: ElementRef<HTMLDialogElement>;
  @ViewChild('videoViewer') private videoViewer?: ElementRef<HTMLDialogElement>;

  activeTab = signal<'all' | 'photos' | 'videos'>('all');
  selectedImageIndex = signal<number>(-1);
  selectedImage = computed(() => {
    const idx = this.selectedImageIndex();
    const list = this.photos();
    return idx >= 0 && idx < list.length ? list[idx] : null;
  });

  selectedVideo = signal<ProcessedVideo | null>(null);
  selectedVideoEmbedUrl = signal<SafeResourceUrl | null>(null);

  photos = signal<ProcessedPhoto[]>(this.initPhotos());
  videos = signal<ProcessedVideo[]>(this.initVideos());

  private initPhotos(): ProcessedPhoto[] {
    const defaultRhythm: CollageSpan[] = ['big', 'normal', 'wide', 'tall', 'normal', 'wide', 'normal', 'normal'];
    return (SITE.gallery as GalleryImage[]).map((img, i) => {
      const hasExplicitSpan = !!img.span;
      const span: CollageSpan = img.span ?? defaultRhythm[i % defaultRhythm.length];
      return {
        src: img.src,
        alt: img.alt,
        caption: img.caption,
        span,
        hasExplicitSpan,
      };
    });
  }

  private initVideos(): ProcessedVideo[] {
    const videoRhythm: CollageSpan[] = ['wide', 'normal', 'wide', 'normal'];
    return (SITE.youtubeVideos as GalleryVideo[]).flatMap((vid, i) => {
      const videoId = this.getYouTubeVideoId(vid.url);
      if (!videoId) return [];

      const isShort = vid.url.includes('/shorts/');
      const span: CollageSpan = vid.span ?? (isShort ? 'tall' : i === 0 ? 'big' : videoRhythm[(i - 1) % videoRhythm.length]);

      return [{
        title: vid.title,
        url: vid.url,
        caption: vid.caption,
        videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${videoId}`),
        span,
        isShort,
      }];
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
      const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([\w-]{11})/);
      return match ? match[1] : (/^[\w-]{11}$/.test(value.trim()) ? value.trim() : null);
    }
  }

  ngOnInit(): void {
    void this.fetchChannelVideos();
  }

  async fetchChannelVideos(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const res = await fetch('/api/youtube');
      if (!res.ok) return;

      const data = (await res.json()) as {
        videos?: Array<{ title: string; url: string; videoId: string }>;
      };

      if (Array.isArray(data.videos) && data.videos.length > 0) {
        this.mergeIncomingVideos(data.videos);
      }
    } catch {
      // In local dev without Cloudflare serverless proxy or if offline, fallback to pre-rendered videos
    }
  }

  private mergeIncomingVideos(incoming: Array<{ title: string; url: string; videoId: string }>): void {
    const currentVideos = this.videos();
    const existingIds = new Set(currentVideos.map((v) => v.videoId));
    const videoRhythm: CollageSpan[] = ['wide', 'normal', 'wide', 'normal'];
    const newItems: ProcessedVideo[] = [];

    for (const item of incoming) {
      if (!item.videoId || existingIds.has(item.videoId)) continue;
      existingIds.add(item.videoId);

      const isShort = item.url.includes('/shorts/');
      const index = currentVideos.length + newItems.length;
      const span: CollageSpan = isShort ? 'tall' : videoRhythm[index % videoRhythm.length];

      newItems.push({
        title: item.title,
        url: item.url,
        caption: item.title,
        videoId: item.videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`,
        watchUrl: `https://www.youtube.com/watch?v=${item.videoId}`,
        embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${item.videoId}`),
        span,
        isShort,
      });
    }

    if (newItems.length > 0) {
      this.videos.update((curr) => [...curr, ...newItems]);
    }
  }

  setTab(tab: 'all' | 'photos' | 'videos'): void {
    this.activeTab.set(tab);
  }

  onImageLoaded(event: Event, index: number): void {
    const target = event.target as HTMLImageElement;
    if (!target || !target.naturalWidth || !target.naturalHeight) return;

    const list = this.photos();
    const item = list[index];
    if (!item || item.hasExplicitSpan) return;

    const ratio = target.naturalWidth / target.naturalHeight;
    let newSpan = item.span;

    if (ratio >= 1.85) {
      newSpan = 'wide';
    } else if (ratio <= 0.8) {
      newSpan = 'tall';
    }

    if (newSpan !== item.span) {
      this.photos.update((current) => {
        const next = [...current];
        next[index] = { ...next[index], span: newSpan };
        return next;
      });
    }
  }

  onVideoThumbError(event: Event, videoId: string): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('hqdefault')) {
      target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  openImage(index: number): void {
    this.selectedImageIndex.set(index);
    this.imageViewer?.nativeElement.showModal();
  }

  closeImage(): void {
    this.imageViewer?.nativeElement.close();
    this.selectedImageIndex.set(-1);
  }

  nextImage(): void {
    const total = this.photos().length;
    if (total === 0) return;
    this.selectedImageIndex.update((curr) => (curr + 1) % total);
  }

  prevImage(): void {
    const total = this.photos().length;
    if (total === 0) return;
    this.selectedImageIndex.update((curr) => (curr - 1 + total) % total);
  }

  openVideo(video: ProcessedVideo): void {
    this.selectedVideo.set(video);
    this.selectedVideoEmbedUrl.set(
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`
      )
    );
    this.videoViewer?.nativeElement.showModal();
  }

  closeVideo(): void {
    this.videoViewer?.nativeElement.close();
    this.selectedVideo.set(null);
    this.selectedVideoEmbedUrl.set(null);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.selectedImageIndex() >= 0) {
      if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'Escape') {
        this.closeImage();
      }
    } else if (this.selectedVideo()) {
      if (event.key === 'Escape') {
        this.closeVideo();
      }
    }
  }
}
