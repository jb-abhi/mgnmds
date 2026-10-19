import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
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
  private steeringAnimation?: Animation;
  private steeringTimer?: ReturnType<typeof setTimeout>;
  private steeringAngle = 0;
  links = [
    { p: '/', t: 'Home' },
    { p: '/about', t: 'About' },
    { p: '/courses', t: 'Courses' },
    { p: '/gallery', t: 'Gallery' },
    { p: '/contact', t: 'Contact' },
  ];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.steerToRandomAngle();
    }
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
