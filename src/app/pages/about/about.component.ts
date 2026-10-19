import { Component } from '@angular/core';
import { SITE } from '../../core/config/site.config';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  s = SITE;
}
