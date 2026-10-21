import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MobileDockComponent } from './shared/components/mobile-dock/mobile-dock.component';
import { SITE } from './core/config/site.config';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MobileDockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  s = SITE;
  toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  showIntro = signal(true);
  introLeaving = signal(false);
  private leaveTimer?: number;
  private hideTimer?: number;

  constructor() {
    inject(ThemeService);
    inject(SeoService).init();
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.showIntro.set(false);
        this.cdr.markForCheck();
        return;
      }

      this.leaveTimer = window.setTimeout(() => {
        this.introLeaving.set(true);
        this.cdr.markForCheck();
      }, 1450);

      this.hideTimer = window.setTimeout(() => {
        this.showIntro.set(false);
        this.cdr.markForCheck();
      }, 1950);
    });
  }

  dismissIntro(): void {
    if (!this.showIntro()) return;
    if (this.leaveTimer) clearTimeout(this.leaveTimer);
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.showIntro.set(false);
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.leaveTimer) clearTimeout(this.leaveTimer);
    if (this.hideTimer) clearTimeout(this.hideTimer);
  }
}
