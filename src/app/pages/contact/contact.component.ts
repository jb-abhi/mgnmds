import { Component } from '@angular/core';
import { SITE } from '../../core/config/site.config';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  s = SITE;
}
