import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SITE } from '../../../core/config/site.config';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-mobile-dock',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mobile-dock.component.html',
  styleUrl: './mobile-dock.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileDockComponent implements AfterViewInit, OnDestroy {
  s = SITE;
  hidden = signal(false);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private scrollTimer: ReturnType<typeof setTimeout> | undefined;
  private boundScroll = () => this.onScrollPassive();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.boundScroll, { passive: true });
    });
  }

  private onScrollPassive(): void {
    if (!this.hidden()) {
      this.ngZone.run(() => this.hidden.set(true));
    }
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      this.ngZone.run(() => this.hidden.set(false));
    }, 800);
  }

  showDock(): void {
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.hidden.set(false);
  }

  ngOnDestroy(): void {
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.boundScroll);
    }
  }
}
