import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../../core/config/site.config';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  s = SITE;
}
