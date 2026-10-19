import { Component } from '@angular/core';
import { SITE } from '../../core/config/site.config';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { EnquiryFormComponent } from '../../shared/components/enquiry-form/enquiry-form.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [IconComponent, EnquiryFormComponent, RevealOnScrollDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  s = SITE;
}
