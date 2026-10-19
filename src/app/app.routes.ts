import { Routes } from '@angular/router';
const t = ' | MGN Motor Driving School';
export const routes: Routes = [
  { path: '', title: 'Driving School in Pulimath, Thiruvananthapuram' + t, data: { description: 'Looking for driving lessons in Pulimath, Thiruvananthapuram? Contact MGN Motor Driving School by phone or WhatsApp to enquire.' }, loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', title: 'About MGN Motor Driving School' + t, data: { description: 'Learn about MGN Motor Driving School in Pulimath, Thiruvananthapuram. Contact us for information about driving lessons.' }, loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'courses', title: 'Driving Courses and Fees' + t, data: { description: 'View driving course categories at MGN Motor Driving School in Thiruvananthapuram, Kerala. Contact us for current availability and fees.' }, loadComponent: () => import('./pages/courses/courses.component').then(m => m.CoursesComponent) },
  { path: 'gallery', title: 'Driving School Gallery' + t, data: { description: 'Explore the gallery of MGN Motor Driving School in Pulimath, Thiruvananthapuram.' }, loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent) },
  { path: 'contact', title: 'Contact MGN Motor Driving School' + t, data: { description: 'Contact MGN Motor Driving School in Pulimath, Thiruvananthapuram by phone, WhatsApp, or the online enquiry form.' }, loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'privacy', title: 'Privacy Policy' + t, data: { description: 'Read the privacy policy for MGN Motor Driving School’s website and online enquiry form.' }, loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: '**', redirectTo: '' }
];
