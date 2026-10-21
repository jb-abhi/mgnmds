import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { ThemeService } from '../../../core/services/theme.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  themeService = inject(ThemeService);
  s = SITE;
  open = signal(false);
  scrollProgress = signal(0);
  private rafPending = false;
  private boundScroll = () => this.onWindowScroll();

  links = [
    { p: '/', t: 'Home' },
    { p: '/about', t: 'About' },
    { p: '/instructor', t: 'Instructor' },
    { p: '/courses', t: 'Courses' },
    { p: '/gallery', t: 'Gallery' },
    { p: '/contact', t: 'Contact' },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.measureScroll();
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.boundScroll, { passive: true });
    });
  }

  private onWindowScroll(): void {
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      this.rafPending = false;
      this.measureScroll();
    });
  }

  private measureScroll(): void {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    const clamped = Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
    if (Math.abs(clamped - this.scrollProgress()) >= 0.5) {
      this.scrollProgress.set(clamped);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.boundScroll);
    }
  }
}
