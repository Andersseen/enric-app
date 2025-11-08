import { Routes } from '@angular/router';

const preventionRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./prevention.page'),
  },
  { path: 'new', loadComponent: () => import('./new/new.page') },
  { path: 'edit', loadComponent: () => import('./edit/edit.page') },
  { path: 'comments', loadComponent: () => import('./comments/page') },
];
export default preventionRoutes;
