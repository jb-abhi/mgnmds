import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
})
export class IconComponent {
  n = input.required<string>({ alias: 'name' });
}
