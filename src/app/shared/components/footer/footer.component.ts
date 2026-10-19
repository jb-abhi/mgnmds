import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  s = SITE;
  year = new Date().getFullYear();
}
