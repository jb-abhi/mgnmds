import { Component } from '@angular/core';
import { SITE } from '../../../core/config/site.config';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-mobile-dock',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mobile-dock.component.html',
  styleUrl: './mobile-dock.component.css',
})
export class MobileDockComponent {
  s = SITE;
}
