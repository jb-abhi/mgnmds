import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input() appReveal: number | string = 0;

  private static sharedObserver?: IntersectionObserver;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = this.elementRef.nativeElement;
    const delay = Math.min(Math.max(Number(this.appReveal) || 0, 0), 8) * 60;
    if (delay > 0) {
      element.style.setProperty('--reveal-delay', `${delay}ms`);
    }

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('reveal', 'is-visible');
      return;
    }

    element.classList.add('reveal');

    if (!RevealOnScrollDirective.sharedObserver) {
      RevealOnScrollDirective.sharedObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              RevealOnScrollDirective.sharedObserver?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
      );
    }

    RevealOnScrollDirective.sharedObserver.observe(element);
  }

  ngOnDestroy(): void {
    const element = this.elementRef?.nativeElement;
    if (element && RevealOnScrollDirective.sharedObserver) {
      RevealOnScrollDirective.sharedObserver.unobserve(element);
    }
  }
}
