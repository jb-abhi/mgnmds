import { Component } from '@angular/core';
import { SITE } from '../../core/config/site.config';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent {
  s = SITE;
}
