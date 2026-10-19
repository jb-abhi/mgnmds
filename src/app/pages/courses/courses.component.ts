import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/config/site.config';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  s = SITE;
}
