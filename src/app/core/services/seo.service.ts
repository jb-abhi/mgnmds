import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SITE } from '../config/site.config';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta); private doc = inject(DOCUMENT); private router = inject(Router);
  init() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      let r = this.router.routerState.snapshot.root; while (r.firstChild) r = r.firstChild;
      const desc = (r.data['description'] as string) ?? SITE.tagline;
      const path = this.router.url.split(/[?#]/)[0];
      const url = SITE.url + (path === '/' ? '' : path);
      const title = this.doc.title;
      this.meta.updateTag({ name: 'description', content: desc });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: desc });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      let link = this.doc.querySelector<HTMLLinkElement>('link[rel=canonical]');
      if (!link) { link = this.doc.createElement('link'); link.rel = 'canonical'; this.doc.head.appendChild(link); }
      link.href = url;
      let ld = this.doc.getElementById('ld') as HTMLScriptElement | null;
      if (!ld) { ld = this.doc.createElement('script'); ld.id = 'ld'; ld.type = 'application/ld+json'; this.doc.head.appendChild(ld); }
      ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'DrivingSchool', name: SITE.name, url: SITE.url, telephone: SITE.phoneDisplay, address: SITE.address, openingHours: SITE.hours });
    });
  }
}
