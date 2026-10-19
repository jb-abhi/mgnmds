import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SITE } from '../../../core/config/site.config';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  s = SITE;
  open = signal(false);
  links = [
    { p: '/', t: 'Home' },
    { p: '/about', t: 'About' },
    { p: '/courses', t: 'Courses' },
    { p: '/gallery', t: 'Gallery' },
    { p: '/contact', t: 'Contact' },
  ];
}
