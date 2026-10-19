import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/services/seo.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MobileDockComponent } from './shared/components/mobile-dock/mobile-dock.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MobileDockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor() {
    inject(SeoService).init();
  }
}
