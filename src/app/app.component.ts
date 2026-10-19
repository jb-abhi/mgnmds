import { afterNextRender, Component, inject, signal } from '@angular/core';
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
export class AppComponent {
  s = SITE;
  showIntro = signal(true);
  introLeaving = signal(false);

  constructor() {
    inject(SeoService).init();
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.showIntro.set(false);
        return;
      }

      window.setTimeout(() => this.introLeaving.set(true), 1450);
      window.setTimeout(() => this.showIntro.set(false), 2000);
    });
  }
}
