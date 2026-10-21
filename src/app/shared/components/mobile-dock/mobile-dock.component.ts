import { Component, HostListener, OnDestroy } from '@angular/core';
import { SITE } from '../../../core/config/site.config';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-mobile-dock',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mobile-dock.component.html',
  styleUrl: './mobile-dock.component.css',
})
export class MobileDockComponent implements OnDestroy {
  s = SITE;
  hidden = false;
  private scrollTimer: ReturnType<typeof setTimeout> | undefined;

  @HostListener('window:scroll')
  onScroll(): void {
    this.hidden = true;
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => this.hidden = false, 900);
  }

  showDock(): void {
    clearTimeout(this.scrollTimer);
    this.hidden = false;
  }

  ngOnDestroy(): void {
    clearTimeout(this.scrollTimer);
  }
}
