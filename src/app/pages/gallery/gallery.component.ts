import { Component } from '@angular/core';
import { SITE } from '../../core/config/site.config';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent {
  s = SITE;
}
