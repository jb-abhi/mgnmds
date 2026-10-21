import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyComponent {}
