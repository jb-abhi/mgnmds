import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'mgn_theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly theme = signal<Theme>('light');
  readonly isDark = computed(() => this.theme() === 'dark');

  private mediaQuery?: MediaQueryList;
  private hasCustomChoice = false;

  constructor() {
    if (this.isBrowser) {
      this.initTheme();
    }
  }

  private initTheme(): void {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (saved === 'light' || saved === 'dark') {
      this.hasCustomChoice = true;
      this.setTheme(saved, false);
    } else {
      this.hasCustomChoice = false;
      const systemTheme: Theme = this.mediaQuery.matches ? 'dark' : 'light';
      this.setTheme(systemTheme, false);
    }

    // Listen for OS scheme changes if user hasn't explicitly set a custom choice
    this.mediaQuery.addEventListener('change', (e) => {
      if (!this.hasCustomChoice) {
        this.setTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  toggleTheme(event?: MouseEvent | Event): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.hasCustomChoice = true;

    if (!this.isBrowser) {
      this.setTheme(next, true);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.setTheme(next, true);
      return;
    }

    // Modern View Transitions API with circular ripple effect
    const doc = document as unknown as {
      startViewTransition?: (callback: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    if (typeof doc.startViewTransition === 'function') {
      let x = window.innerWidth / 2;
      let y = 0;

      if (event instanceof MouseEvent && event.clientX && event.clientY) {
        x = event.clientX;
        y = event.clientY;
      } else {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
          const rect = toggleBtn.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(() => {
        this.setTheme(next, true);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 450,
              easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          // Fallback if transition fails
        });
      return;
    }

    // CSS Transition Fallback for older browsers
    this.triggerCssThemeTransition();
    this.setTheme(next, true);
  }

  private triggerCssThemeTransition(): void {
    if (!this.isBrowser) return;
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 400);
  }

  setTheme(theme: Theme, persist = true): void {
    this.theme.set(theme);

    if (this.isBrowser) {
      if (persist) {
        try {
          localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
          // Ignore localStorage availability issues
        }
      }

      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      root.style.colorScheme = theme;

      // Update meta theme-color for mobile address bar
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0B1220' : '#101827');
      }
    }
  }
}
