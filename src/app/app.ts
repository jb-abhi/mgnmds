import { Component, inject, signal } from "@angular/core";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { SITE } from "./site.config";
import { Seo } from "./seo";
import { Ic } from "./ic";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Ic],
  template: ` <a class="skip" href="#main">Skip to content</a>
    <header class="bar">
      <div class="wrap row">
        <a routerLink="/" class="brand" (click)="open.set(false)">{{
          s.name
        }}</a>
        <button
          class="burger"
          type="button"
          [attr.aria-expanded]="open()"
          aria-controls="nav"
          (click)="open.set(!open())"
        >
          <app-ic [name]="open() ? 'close' : 'menu'" /><span class="sr"
            >Menu</span
          >
        </button>
        <nav id="nav" aria-label="Main" [class.open]="open()">
          <ul>
            @for (l of links; track l.p) {
              <li>
                <a
                  [routerLink]="l.p"
                  routerLinkActive="on"
                  [routerLinkActiveOptions]="{ exact: true }"
                  (click)="open.set(false)"
                  >{{ l.t }}</a
                >
              </li>
            }
          </ul>
        </nav>
        <a class="btn y call" href="tel:{{ s.phone }}">
          <app-ic name="phone" />
          <span class="call-now-text">Call now</span>
        </a>
      </div>
      <div class="road" aria-hidden="true"></div>
    </header>
    <main id="main"><router-outlet /></main>
    <footer class="site-footer">
      <div class="wrap foot">
        <div>
          <p class="brand">{{ s.name }}</p>
          <p class="m">{{ s.tagline }}</p>
        </div>
        <div>
          <h2>Visit</h2>
          <p>{{ s.address }}</p>
          <p>{{ s.hours }}</p>
        </div>
        <div>
          <h2>Reach us</h2>
          <p>
            <a href="tel:{{ s.phone }}">{{ s.phoneDisplay }}</a>
          </p>
          <p><a [href]="'https://wa.me/' + s.whatsapp">WhatsApp</a></p>
          <p><a routerLink="/privacy">Privacy policy</a></p>
        </div>
      </div>
    </footer>
    <div class="dock">
      <a class="btn y" href="tel:{{ s.phone }}"><app-ic name="phone" />Call</a
      ><a class="btn dk" [href]="'https://wa.me/' + s.whatsapp"
        ><app-ic name="chat" />WhatsApp</a
      >
    </div>`,
})
export class App {
  s = SITE;
  open = signal(false);
  links = [
    { p: "/", t: "Home" },
    { p: "/about", t: "About" },
    { p: "/courses", t: "Courses" },
    { p: "/gallery", t: "Gallery" },
    { p: "/contact", t: "Contact" },
  ];
  constructor() {
    inject(Seo).init();
    inject(Router);
  }
}
