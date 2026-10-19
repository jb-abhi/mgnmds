import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../site.config';
import { Ic } from '../ic';

@Component({ selector: 'app-home', imports: [RouterLink, Ic], template: `
<section class="hero">
  <img [src]="s.images.hero" [alt]="s.images.heroAlt" width="1600" height="1000" fetchpriority="high">
  <div class="wrap hero-in">
    <h1>Drive Defensively. <span>Drive Confidently.</span></h1>
    <p class="lead">{{ s.tagline }}</p>
    <div class="acts">
      <a class="btn y" routerLink="/courses">Explore courses</a>
      <a class="btn ln hero-contact-btn" href="tel:{{ s.phone }}"><app-ic name="phone" />Call now</a>
      <a class="btn ln hero-contact-btn" [href]="'https://wa.me/' + s.whatsapp"><app-ic name="chat" />WhatsApp</a>
    </div>
  </div>
  <p class="where wrap"><app-ic name="pin" />Serving {{ s.serviceArea }}</p>
</section>

<section class="wrap split sec">
  <div class="stick"><h2>Why learners choose us</h2><p class="m">[Introduce the school in two honest sentences.]</p></div>
  <ul class="ben">@for (b of s.benefits; track b.title) { <li><h3>{{ b.title }}</h3><p>{{ b.text }}</p></li> }</ul>
</section>

<section class="dark sec"><div class="wrap">
  <div class="head"><h2>Courses</h2><a href="/courses" routerLink="/courses">All courses and fees</a></div>
  <ul class="rows">@for (c of s.courses; track c.name) { <li><h3>{{ c.name }}</h3><p>{{ c.text }}</p><span class="fee">{{ c.fee }}</span></li> }</ul>
</div></section>

<section class="wrap sec"><div class="head"><h2>Inside the school</h2><a routerLink="/gallery">Full gallery</a></div>
  <div class="mosaic">@for (g of s.gallery; track g.src) { <figure><img [src]="g.src" [alt]="g.alt" width="800" height="500" loading="lazy"><figcaption>{{ g.caption }}</figcaption></figure> }</div>
</section>

@if (s.testimonials.length) {
<section class="wrap sec"><h2>What learners say</h2>
  <div class="quotes">@for (t of s.testimonials; track t.name) { <blockquote><p>{{ t.quote }}</p><footer>{{ t.name }}</footer></blockquote> }</div></section>
}

<section class="cta extend-section"><div class="wrap"><h2>Ready to start driving?</h2>
  <div class="acts"><a class="btn dk" href="tel:{{ s.phone }}"><app-ic name="phone" />{{ s.phoneDisplay }}</a>
  <a class="btn ln-d" [href]="'https://wa.me/' + s.whatsapp"><app-ic name="chat" />WhatsApp</a>
  <a class="btn ln-d" routerLink="/contact">Visit us</a></div></div></section>` })
export class Home { s = SITE; }

@Component({ selector: 'app-about', template: `
<header class="ph"><div class="wrap"><h1>About {{ s.name }}</h1><p class="lead">[One-line summary of the school.]</p></div></header>
<section class="wrap split sec"><img class="tall" [src]="s.images.about" [alt]="s.images.aboutAlt" width="800" height="1000" loading="lazy">
  <div class="prose"><h2>Our story</h2><p>[Write the school's story with true facts: when it started, vehicles, approach.]</p>
  <h2>Our instructors</h2><p>[Instructor names and experience, confirmed by the school.]</p></div></section>` })
export class About { s = SITE; }

@Component({ selector: 'app-courses', imports: [RouterLink], template: `
<header class="ph"><div class="wrap"><h1>Courses and fees</h1><p class="lead">Licence categories we teach. Fees are set by the school.</p></div></header>
<section class="wrap sec"><ul class="rows light">@for (c of s.courses; track c.name) { <li><h2>{{ c.name }}</h2><p>{{ c.text }}</p><span class="fee">{{ c.fee }}</span></li> }</ul>
<p><a class="btn dk" routerLink="/contact">Ask about a course</a></p></section>` })
export class Courses { s = SITE; }

@Component({ selector: 'app-gallery', template: `
<header class="ph"><div class="wrap"><h1>Photo gallery</h1><p class="lead">Vehicles, instructors and training.</p></div></header>
<section class="wrap sec"><div class="mosaic big">@for (g of s.gallery; track g.src) { <figure><img [src]="g.src" [alt]="g.alt" width="800" height="500" loading="lazy"><figcaption>{{ g.caption }}</figcaption></figure> }</div></section>` })
export class Gallery { s = SITE; }

@Component({ selector: 'app-contact', imports: [Ic], template: `
<header class="ph"><div class="wrap"><h1>Contact us</h1><p class="lead">Call or message us. We reply during opening hours.</p></div></header>
<section class="wrap sec contact">
  <div class="panel"><h2>Talk to us</h2>
    <p><a class="big" href="tel:{{ s.phone }}">{{ s.phoneDisplay }}</a></p>
    <p><a class="btn y" href="tel:{{ s.phone }}"><app-ic name="phone" />Call now</a> <a class="btn ln" [href]="'https://wa.me/' + s.whatsapp"><app-ic name="chat" />WhatsApp</a></p>
    <h3>Address</h3><p>{{ s.address }}</p><h3>Hours</h3><p>{{ s.hours }}</p>
    <p class="m">An online enquiry form is coming soon.</p></div>
  <div class="map">@if (s.mapsEmbedUrl) { <iframe title="Map" [src]="s.mapsEmbedUrl" loading="lazy"></iframe> } @else { <p>[Add the Google Maps embed link in site.config.ts.]</p> }</div>
</section>` })
export class Contact { s = SITE; }

@Component({ selector: 'app-privacy', template: `
<header class="ph"><div class="wrap"><h1>Privacy policy</h1></div></header>
<section class="wrap sec"><div class="prose"><p>[Draft placeholder. Have this reviewed before launch.] We collect only the details you give us, such as your name and phone number, to reply to your enquiry. We do not sell your information.</p></div></section>` })
export class Privacy {}
