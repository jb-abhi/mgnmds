import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SITE, ReviewItem } from '../../core/config/site.config';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { EnquiryFormComponent } from '../../shared/components/enquiry-form/enquiry-form.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

export interface JourneyMilestone {
  step: string;
  title: string;
  description: string;
  icon: string;
  skills: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IconComponent, EnquiryFormComponent, RevealOnScrollDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  s = SITE;
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  mapEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(SITE.mapsEmbedUrl);
  mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE.name}, ${SITE.address}`)}`;
  currentSlide = signal(0);
  youtubeVideos = signal<{ title: string; embedUrl: SafeResourceUrl; videoId: string }[]>(this.initYoutubeVideos());
  homeVideos = signal<{ title: string; embedUrl: SafeResourceUrl; videoId: string }[]>(this.initYoutubeVideos().slice(0, 4));
  homeGallery = SITE.gallery.slice(0, 5);
  @ViewChild('imageViewer') private imageViewer?: ElementRef<HTMLDialogElement>;
  selectedImage = signal<(typeof SITE.gallery)[number] | null>(null);
  aboutImageLoaded = signal(false);

  // Learning Journey Milestone Definitions
  journeyMilestones: JourneyMilestone[] = [
    {
      step: '01',
      title: 'Start Your Journey',
      description: 'Get introduced to the vehicle, driving controls, and basic road safety.',
      icon: 'steering-wheel',
      skills: ['Vehicle Cockpit', 'Control Layout', 'Mirror Setup', 'Road Safety Rules'],
    },
    {
      step: '02',
      title: 'Master the Basics',
      description: 'Learn steering, clutch control, braking, gear changes, and smooth vehicle movement.',
      icon: 'gear-shift',
      skills: ['Clutch Bite Point', 'Gear Shifting', 'Smooth Braking', 'Steering Control'],
    },
    {
      step: '03',
      title: 'Practice on the Road',
      description: 'Develop awareness, lane discipline, mirror usage, turning skills, and safe driving habits.',
      icon: 'road-awareness',
      skills: ['Lane Discipline', 'Mirror Checks', 'Junction Turns', 'Traffic Awareness'],
    },
    {
      step: '04',
      title: 'Build Your Confidence',
      description: 'Improve decision-making, manoeuvring, parking, and handling different road situations.',
      icon: 'parking-sign',
      skills: ['Parallel Parking', 'Reverse Manoeuvres', 'Hill Starts', 'Traffic Decisions'],
    },
    {
      step: '05',
      title: 'Get Ready for Your Licence',
      description: 'Prepare for the driving test and work towards becoming a confident, responsible driver.',
      icon: 'licence-badge',
      skills: ['Mock Test Practice', 'Route Navigation', 'Defensive Mindset', 'Independent Driving'],
    },
  ];

  @ViewChild('trackWrapper') private trackWrapper?: ElementRef<HTMLElement>;
  @ViewChild('roadCanvas') private roadCanvas?: ElementRef<SVGSVGElement>;
  @ViewChild('startLandmark') private startLandmark?: ElementRef<HTMLElement>;
  @ViewChild('finishLandmark') private finishLandmark?: ElementRef<HTMLElement>;
  @ViewChild('destinationPin') private destinationPin?: ElementRef<HTMLElement>;
  @ViewChild('instructorHighlights') private instructorHighlights?: ElementRef<HTMLElement>;
  @ViewChildren('milestoneItem') private milestoneItems?: QueryList<ElementRef<HTMLElement>>;

  roadPathD = signal<string>('');
  roadTotalLength = signal<number>(1000);
  roadProgressOffset = signal<number>(1000);
  carTransform = signal<string>('translate(0, 0) rotate(0)');
  carOpacity = signal<number>(0);
  activeMilestoneIndex = signal<number>(-1);
  isDestinationReached = signal<boolean>(false);
  displayedYears = signal<string>('25');
  displayedStudents = signal<string>('1,000');
  canvasWidth = signal<number>(1000);
  canvasHeight = signal<number>(1200);

  private resizeObserver?: ResizeObserver;
  private instructorObserver?: IntersectionObserver;
  private instructorAnimStarted = false;
  private stationPoints: { y: number; fraction: number }[] = [];
  private rafId?: number;
  private currentCarProgress = 0;
  private targetCarProgress = 0;
  private isCarAnimating = false;
  private stationFractions: number[] = [0.16, 0.33, 0.50, 0.67, 0.83];
  private boundOnScroll = () => this.onScroll();
  private boundOnResize = () => this.onWindowResize();
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

  private boundVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.hidden) {
      this.stopSlideShow();
    } else {
      this.startSlideShow();
    }
  };

  private startSlideShow(): void {
    if (this.slideInterval || this.s.images.heroSlides.length <= 1) return;
    this.slideInterval = setInterval(() => {
      this.currentSlide.update((index) => (index + 1) % this.s.images.heroSlides.length);
    }, 5500);
  }

  private stopSlideShow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = undefined;
    }
  }

  ngOnInit(): void {
    void this.fetchLiveGoogleReviews();
    void this.fetchLiveYouTubeVideos();
    if (isPlatformBrowser(this.platformId)) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced && this.s.images.heroSlides.length > 1) {
        this.startSlideShow();
        document.addEventListener('visibilitychange', this.boundVisibilityChange);
      }
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

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initJourneyTracker();
    this.initInstructorStatsAnimation();
  }

  private initInstructorStatsAnimation(): void {
    if (!this.instructorHighlights) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      this.displayedYears.set('25');
      this.displayedStudents.set('1,000');
      this.cdr.markForCheck();
      return;
    }

    this.displayedYears.set('0');
    this.displayedStudents.set('0');
    this.cdr.markForCheck();

    if (typeof window.IntersectionObserver !== 'undefined') {
      this.instructorObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.instructorAnimStarted) {
            this.instructorAnimStarted = true;
            this.animateInstructorStats();
            this.instructorObserver?.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '40px 0px 40px 0px' }
      );
      this.instructorObserver.observe(this.instructorHighlights.nativeElement);
    } else {
      this.animateInstructorStats();
    }
  }

  private animateInstructorStats(): void {
    const targetYears = 25;
    const targetStudents = 1000;
    const duration = 1600;
    const startTime = performance.now();

    this.ngZone.runOutsideAngular(() => {
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);

        const currentYears = Math.round(targetYears * ease);
        const currentStudents = Math.round(targetStudents * ease);

        this.displayedYears.set(currentYears.toString());
        this.displayedStudents.set(currentStudents.toLocaleString('en-IN'));
        this.cdr.detectChanges();

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          this.displayedYears.set('25');
          this.displayedStudents.set('1,000');
          this.cdr.detectChanges();
        }
      };

      requestAnimationFrame(step);
    });
  }

  private initJourneyTracker(): void {
    if (!this.trackWrapper) return;

    // Check for prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      this.activeMilestoneIndex.set(4);
      this.isDestinationReached.set(true);
      this.carOpacity.set(0);
      this.updateRoadGeometry();
      this.cdr.markForCheck();
      return;
    }

    // Set up ResizeObserver to update road geometry whenever layout changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateRoadGeometry();
      });
      this.resizeObserver.observe(this.trackWrapper.nativeElement);
    }

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('resize', this.boundOnResize, { passive: true });
      window.addEventListener('scroll', this.boundOnScroll, { passive: true });
    });

    // Initial pass after rendering
    setTimeout(() => {
      this.updateRoadGeometry();
      this.onScroll();
    }, 60);
  }

  private onWindowResize(): void {
    this.updateRoadGeometry();
    this.onScroll();
  }

  private updateRoadGeometry(): void {
    if (!this.trackWrapper || !this.startLandmark || !this.finishLandmark || !this.milestoneItems) return;

    const wrapper = this.trackWrapper.nativeElement;
    const containerRect = wrapper.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) return;

    this.canvasWidth.set(width);
    this.canvasHeight.set(height);

    const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 900 : false;
    const startRect = this.startLandmark.nativeElement.getBoundingClientRect();
    const finishRect = this.finishLandmark.nativeElement.getBoundingClientRect();

    // Road start point
    const p0 = {
      x: isMobile ? 23 : width / 2,
      y: Math.max(12, startRect.bottom - containerRect.top + 6),
    };

    // Calculate milestone waypoint points
    const items = this.milestoneItems.toArray();
    if (items.length === 0) return;

    // Desktop horizontal weaving swing offset
    const desktopOffset = Math.min(90, Math.max(56, width * 0.085));

    const waypoints = items.map((item, idx) => {
      const pinEl = item.nativeElement.querySelector('.milestone-station-pin') as HTMLElement | null;
      let itemCenterY: number;

      if (pinEl) {
        const pinRect = pinEl.getBoundingClientRect();
        itemCenterY = pinRect.top - containerRect.top + pinRect.height / 2;
      } else {
        const itemRect = item.nativeElement.getBoundingClientRect();
        itemCenterY = itemRect.top - containerRect.top + itemRect.height / 2;
      }

      let x: number;
      if (isMobile) {
        x = 23;
      } else {
        // Alternating curve: Stage 1, 3, 5 curve left; Stage 2, 4 curve right
        const sign = idx % 2 === 0 ? -1 : 1;
        x = width / 2 + sign * desktopOffset;
      }

      return { x, y: itemCenterY };
    });

    // Road finish point - verify destination pin is actually rendered with dimensions
    const destPinEl = this.destinationPin?.nativeElement;
    const destPinRect = destPinEl ? destPinEl.getBoundingClientRect() : null;
    const hasVisibleDestPin = destPinRect && destPinRect.height > 0 && destPinRect.width > 0;

    let pFinishX: number;
    let pFinishY: number;

    if (isMobile && hasVisibleDestPin) {
      pFinishX = 23;
      pFinishY = destPinRect.top - containerRect.top + destPinRect.height / 2;
    } else if (isMobile) {
      pFinishX = 23;
      pFinishY = finishRect.top - containerRect.top + 28;
    } else {
      pFinishX = width / 2;
      pFinishY = Math.min(height - 12, finishRect.top - containerRect.top - 8);
    }

    // Safety fallback: ensure finish point is ALWAYS strictly after all milestone waypoints
    const lastWaypointY = waypoints[waypoints.length - 1].y;
    if (pFinishY <= lastWaypointY) {
      pFinishY = lastWaypointY + 140;
    }

    const pFinish = { x: pFinishX, y: pFinishY };

    const points = [p0, ...waypoints, pFinish];

    // Build smooth cubic Bézier spline through all points
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const ptA = points[i];
      const ptB = points[i + 1];
      const dy = ptB.y - ptA.y;
      const c1x = ptA.x;
      const c1y = ptA.y + dy * 0.45;
      const c2x = ptB.x;
      const c2y = ptB.y - dy * 0.45;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${ptB.x.toFixed(1)} ${ptB.y.toFixed(1)}`;
    }

    this.roadPathD.set(d);

    // Measure path length and update car position
    requestAnimationFrame(() => {
      this.updatePathMetricsAndCar();
    });
  }

  private updatePathMetricsAndCar(): void {
    if (!this.roadCanvas || !this.trackWrapper || !this.milestoneItems || !this.finishLandmark) return;
    const pathEl = this.roadCanvas.nativeElement.querySelector('.road-path-surface') as SVGPathElement | null;
    if (!pathEl) return;

    try {
      const totalLength = pathEl.getTotalLength();
      if (totalLength <= 0) return;

      this.roadTotalLength.set(totalLength);

      // Compute station fractions along path for accurate milestone activation
      const containerRect = this.trackWrapper.nativeElement.getBoundingClientRect();
      const items = this.milestoneItems.toArray();
      this.stationFractions = items.map((item, i) => {
        const pinEl = item.nativeElement.querySelector('.milestone-station-pin') as HTMLElement | null;
        let targetY: number;
        if (pinEl) {
          const pinRect = pinEl.getBoundingClientRect();
          targetY = pinRect.top - containerRect.top + pinRect.height / 2;
        } else {
          const itemRect = item.nativeElement.getBoundingClientRect();
          targetY = itemRect.top - containerRect.top + itemRect.height / 2;
        }
        let bestFraction = (i + 1) / (items.length + 1);
        for (let f = 0.02; f <= 0.99; f += 0.01) {
          const pt = pathEl.getPointAtLength(totalLength * f);
          if (pt.y >= targetY) {
            bestFraction = f;
            break;
          }
        }
        return bestFraction;
      });

      const startRect = this.startLandmark?.nativeElement.getBoundingClientRect();
      const startY = startRect ? Math.max(12, startRect.bottom - containerRect.top + 6) : 12;

      const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 900 : false;
      const finishRect = this.finishLandmark.nativeElement.getBoundingClientRect();
      const destPinEl = this.destinationPin?.nativeElement;
      const destPinRect = destPinEl ? destPinEl.getBoundingClientRect() : null;
      const hasVisibleDestPin = destPinRect && destPinRect.height > 0 && destPinRect.width > 0;

      let finishY: number;
      if (isMobile && hasVisibleDestPin) {
        finishY = destPinRect.top - containerRect.top + destPinRect.height / 2;
      } else if (isMobile) {
        finishY = finishRect.top - containerRect.top + 28;
      } else {
        finishY = Math.min(containerRect.height - 12, finishRect.top - containerRect.top - 8);
      }

      const rawStations = [
        { y: startY, fraction: 0 },
        ...items.map((item, idx) => {
          const pinEl = item.nativeElement.querySelector('.milestone-station-pin') as HTMLElement | null;
          let yVal: number;
          if (pinEl) {
            const pinRect = pinEl.getBoundingClientRect();
            yVal = pinRect.top - containerRect.top + pinRect.height / 2;
          } else {
            const r = item.nativeElement.getBoundingClientRect();
            yVal = r.top - containerRect.top + r.height / 2;
          }
          return {
            y: yVal,
            fraction: this.stationFractions[idx],
          };
        }),
      ];

      // Guarantee finishY is strictly after the last milestone
      const lastStationY = rawStations[rawStations.length - 1].y;
      if (finishY <= lastStationY) {
        finishY = lastStationY + 140;
      }

      rawStations.push({ y: finishY, fraction: 1.0 });

      // Guarantee strictly increasing Y values for all stations (prevent any early destination jumps)
      let currentMinY = 0;
      for (const st of rawStations) {
        if (st.y <= currentMinY) {
          st.y = currentMinY + 40;
        }
        currentMinY = st.y;
      }

      this.stationPoints = rawStations;

      this.renderCarAtProgress(this.currentCarProgress);
    } catch {
      // SVG not yet rendered or zero-sized
    }
  }

  private scrollTickPending = false;

  private onScroll(): void {
    if (!this.instructorAnimStarted && this.instructorHighlights) {
      const r = this.instructorHighlights.nativeElement.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top < vh * 0.92 && r.bottom > 0) {
        this.instructorAnimStarted = true;
        this.animateInstructorStats();
        if (this.instructorObserver) {
          this.instructorObserver.disconnect();
        }
      }
    }

    if (this.scrollTickPending) return;
    this.scrollTickPending = true;
    requestAnimationFrame(() => {
      this.scrollTickPending = false;
      this.measureScrollProgress();
    });
  }

  private measureScrollProgress(): void {
    if (!this.trackWrapper || this.stationPoints.length < 2) return;
    const rect = this.trackWrapper.nativeElement.getBoundingClientRect();
    const vh = window.innerHeight;

    // Viewport focal line: center of user view
    const focusY = vh * 0.50;
    const currentY = focusY - rect.top;

    const startStation = this.stationPoints[0];
    const endStation = this.stationPoints[this.stationPoints.length - 1];

    let progress = 0;

    if (currentY <= startStation.y) {
      progress = 0;
    } else if (currentY >= endStation.y) {
      progress = 1.0;
    } else {
      // Piecewise linear interpolation between stations
      for (let i = 0; i < this.stationPoints.length - 1; i++) {
        const sA = this.stationPoints[i];
        const sB = this.stationPoints[i + 1];
        if (currentY >= sA.y && currentY <= sB.y) {
          const segRange = Math.max(1, sB.y - sA.y);
          let segT = Math.max(0, Math.min(1, (currentY - sA.y) / segRange));

          if (i === 0) {
            // Smooth natural acceleration out of Start Line (0 -> 1)
            // Real car acceleration curve: smooth cubic easing so the vehicle
            // starts deliberately and builds motion smoothly rather than rushing
            segT = segT * segT * (3 - 2 * segT);
          }

          progress = sA.fraction + segT * (sB.fraction - sA.fraction);
          break;
        }
      }
    }

    progress = Math.max(0, Math.min(1, progress));
    this.targetCarProgress = progress;

    if (!this.isCarAnimating) {
      this.isCarAnimating = true;
      this.animateCarFrame();
    }
  }

  private animateCarFrame(): void {
    const diff = this.targetCarProgress - this.currentCarProgress;
    if (Math.abs(diff) < 0.001) {
      this.currentCarProgress = this.targetCarProgress;
      this.isCarAnimating = false;
    } else {
      // Dynamic momentum easing: gentler and smoother from 0 to 1, snappy thereafter
      const m1Fraction = this.stationPoints[1]?.fraction ?? 0.05;
      const isInitialSegment = this.currentCarProgress <= m1Fraction * 1.15;
      const easeFactor = isInitialSegment ? 0.14 : 0.26;
      this.currentCarProgress += diff * easeFactor;
    }

    this.renderCarAtProgress(this.currentCarProgress);
    this.cdr.detectChanges();

    if (this.isCarAnimating) {
      this.rafId = requestAnimationFrame(() => this.animateCarFrame());
    }
  }

  private renderCarAtProgress(progress: number): void {
    if (!this.roadCanvas || !this.trackWrapper) return;
    const pathEl = this.roadCanvas.nativeElement.querySelector('.road-path-surface') as SVGPathElement | null;
    if (!pathEl) return;

    try {
      const totalLength = pathEl.getTotalLength();
      if (totalLength <= 0) return;

      const currentLength = totalLength * progress;
      const pt = pathEl.getPointAtLength(currentLength);

      // Forward/backward tangent vector calculation for smooth banking
      const delta = 2.5;
      const ptForward = pathEl.getPointAtLength(Math.min(totalLength, currentLength + delta));
      const ptBackward = pathEl.getPointAtLength(Math.max(0, currentLength - delta));
      const angleRad = Math.atan2(ptForward.y - ptBackward.y, ptForward.x - ptBackward.x);
      const angleDeg = (angleRad * 180) / Math.PI;

      // Car SVG is drawn oriented downwards (+Y, 90 deg)
      const rotationDeg = angleDeg - 90;

      const isMobile = this.canvasWidth() < 900;
      const scale = isMobile ? 0.85 : 1.0;

      this.carTransform.set(`translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${rotationDeg.toFixed(1)}) scale(${scale})`);
      this.carOpacity.set(1);
      this.roadProgressOffset.set(totalLength * (1 - progress));

      // Update active milestone only when index changes
      let activeIdx = -1;
      for (let i = 0; i < this.stationFractions.length; i++) {
        const leadThreshold = Math.min(0.025, i === 0 ? this.stationFractions[0] * 0.5 : 0.03);
        if (progress >= this.stationFractions[i] - leadThreshold) {
          activeIdx = i;
        }
      }
      if (this.activeMilestoneIndex() !== activeIdx) {
        this.activeMilestoneIndex.set(activeIdx);
      }

      // Check destination reached
      const isReached = progress >= 0.96;
      if (this.isDestinationReached() !== isReached) {
        this.isDestinationReached.set(isReached);
      }
    } catch {
      // Safe fallback if SVG path methods fail
    }
  }

  scrollToMilestone(index: number): void {
    if (this.milestoneItems) {
      const items = this.milestoneItems.toArray();
      if (items[index]) {
        items[index].nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  ngOnDestroy(): void {
    this.stopSlideShow();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.instructorObserver) this.instructorObserver.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.boundOnScroll);
      window.removeEventListener('resize', this.boundOnResize);
      document.removeEventListener('visibilitychange', this.boundVisibilityChange);
    }
  }
}
