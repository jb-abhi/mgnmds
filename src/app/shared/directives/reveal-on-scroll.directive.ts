import { AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input() appReveal: number | string = 0;

  private observer?: IntersectionObserver;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = this.elementRef.nativeElement;
    const delay = Math.min(Math.max(Number(this.appReveal) || 0, 0), 8) * 70;
    element.style.setProperty('--reveal-delay', `${delay}ms`);

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('reveal', 'is-visible');
      return;
    }

    element.classList.add('reveal');
    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.add('is-visible');
      this.observer?.unobserve(element);
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
