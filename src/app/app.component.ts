import { afterNextRender, Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/services/seo.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MobileDockComponent } from './shared/components/mobile-dock/mobile-dock.component';
import { SITE } from './core/config/site.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MobileDockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnDestroy {
  @ViewChild('introWheel') private introWheel?: ElementRef<HTMLImageElement>;
  s = SITE;
  showIntro = signal(true);
  introLeaving = signal(false);
  private introAnimation?: Animation;
  private introAngle = 0;
  private leaveTimer?: number;
  private hideTimer?: number;
  private steerTimer?: number;

  constructor() {
    inject(SeoService).init();
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.showIntro.set(false);
        return;
      }

      this.steerIntroWheel();
      this.leaveTimer = window.setTimeout(() => this.introLeaving.set(true), 1450);
      this.hideTimer = window.setTimeout(() => {
        this.introAnimation?.cancel();
        this.showIntro.set(false);
      }, 2000);
    });
  }

  ngOnDestroy(): void {
    this.introAnimation?.cancel();
    if (this.leaveTimer) clearTimeout(this.leaveTimer);
    if (this.hideTimer) clearTimeout(this.hideTimer);
    if (this.steerTimer) clearTimeout(this.steerTimer);
  }

  private steerIntroWheel(): void {
    const element = this.introWheel?.nativeElement;
    if (!element || !this.showIntro()) return;

    const target = Math.round((Math.random() * 32 - 16) * 10) / 10;
    this.introAnimation = element.animate(
      [
        { transform: `rotate(${this.introAngle}deg)` },
        { transform: `rotate(${target}deg)` },
      ],
      { duration: 350 + Math.random() * 700, easing: 'ease-in-out', fill: 'forwards' },
    );
    this.introAnimation.onfinish = () => {
      this.introAngle = target;
      if (this.showIntro()) {
        this.steerTimer = window.setTimeout(() => this.steerIntroWheel(), 120 + Math.random() * 400);
      }
    };
  }
}
