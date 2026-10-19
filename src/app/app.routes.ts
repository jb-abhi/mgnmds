import { Routes } from '@angular/router';
const t = ' | Your Driving School';
export const routes: Routes = [
  { path: '', title: 'Driving school in Kerala' + t, data: { description: 'Driving lessons and licence training in Kerala. Call or WhatsApp to enquire.' }, loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', title: 'About us' + t, data: { description: 'About our driving school and instructors.' }, loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'courses', title: 'Courses and fees' + t, data: { description: 'Driving courses and licence categories we teach.' }, loadComponent: () => import('./pages/courses/courses.component').then(m => m.CoursesComponent) },
  { path: 'gallery', title: 'Photo gallery' + t, data: { description: 'Photos of our vehicles, instructors and training.' }, loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent) },
  { path: 'contact', title: 'Contact us' + t, data: { description: 'Phone, address, opening hours and map.' }, loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'privacy', title: 'Privacy policy' + t, data: { description: 'How we handle your personal information.' }, loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: '**', redirectTo: '' }
];
