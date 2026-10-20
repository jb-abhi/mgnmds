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
      const origin = SITE.url.replace(/\/+$/, '');
      const url = `${origin}${path === '/' ? '/' : path}`;
      const title = this.doc.title;
      this.meta.updateTag({ name: 'description', content: desc });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: desc });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ property: 'og:type', content: 'website' });
      this.meta.updateTag({ property: 'og:image', content: `${origin}/images/social-share.png` });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
      this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });
      this.meta.updateTag({ property: 'og:image:alt', content: `${SITE.name}, ${SITE.town}, Kerala` });
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.meta.updateTag({ name: 'twitter:title', content: title });
      this.meta.updateTag({ name: 'twitter:description', content: desc });
      this.meta.updateTag({ name: 'twitter:image', content: `${origin}/images/social-share.png` });
      let link = this.doc.querySelector<HTMLLinkElement>('link[rel=canonical]');
      if (!link) { link = this.doc.createElement('link'); link.rel = 'canonical'; this.doc.head.appendChild(link); }
      link.href = url;
      let ld = this.doc.getElementById('ld') as HTMLScriptElement | null;
      if (!ld) { ld = this.doc.createElement('script'); ld.id = 'ld'; ld.type = 'application/ld+json'; this.doc.head.appendChild(ld); }
      ld.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${origin}/#school`,
        name: SITE.name,
        url: `${origin}/`,
        telephone: SITE.phone,
        image: `${origin}/images/mgn-emblem-blue.png`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Pedikulam, Pulimath P.O.',
          addressLocality: SITE.town,
          addressRegion: 'Kerala',
          postalCode: '695612',
          addressCountry: 'IN',
        },
        areaServed: SITE.serviceArea,
      });
    });
  }
}
