import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('steeringLogo') private steeringLogo?: ElementRef<HTMLImageElement>;
  s = SITE;
  open = signal(false);
  scrollProgress = signal(0);
  private steeringAnimation?: Animation;
  private steeringTimer?: ReturnType<typeof setTimeout>;
  private steeringAngle = 0;
  links = [
    { p: '/', t: 'Home' },
    { p: '/about', t: 'About' },
    { p: '/instructor', t: 'Instructor' },
    { p: '/courses', t: 'Courses' },
    { p: '/gallery', t: 'Gallery' },
    { p: '/contact', t: 'Contact' },
  ];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateScrollProgress();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.steerToRandomAngle();
      }
    }
  }

  @HostListener('window:scroll')
  updateScrollProgress(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    this.scrollProgress.set(Math.min(100, Math.max(0, progress)));
  }

  ngOnDestroy(): void {
    this.steeringAnimation?.cancel();
    if (this.steeringTimer) clearTimeout(this.steeringTimer);
  }

  private steerToRandomAngle(): void {
    const target = Math.round((Math.random() * 32 - 16) * 10) / 10;
    const duration = 350 + Math.random() * 700;
    const element = this.steeringLogo?.nativeElement;
    if (!element) return;

    this.steeringAnimation = element.animate(
      [
        { transform: `rotate(${this.steeringAngle}deg)` },
        { transform: `rotate(${target}deg)` },
      ],
      { duration, easing: 'ease-in-out', fill: 'forwards' },
    );
    this.steeringAnimation.onfinish = () => {
      this.steeringAngle = target;
      this.steeringTimer = setTimeout(() => this.steerToRandomAngle(), 120 + Math.random() * 650);
    };
  }
}
