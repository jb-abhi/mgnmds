import { Component, signal } from '@angular/core';
import { SITE } from '../../core/config/site.config';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  s = SITE;
  imageLoaded = signal(false);
  mosaicTiles = Array.from({ length: 36 }, (_, index) => ({
    id: index,
    delay: ((index * 13) % 36) * 30,
  }));
}
