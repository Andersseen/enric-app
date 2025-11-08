import { Routes } from '@angular/router';

const actingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./acting.page'),
  },
  // { path: 'new', loadComponent: () => import('./new/new.page') },
  // { path: 'edit', loadComponent: () => import('./edit/edit.page') },
  // { path: 'comments', loadComponent: () => import('./comments/page') },
];
export default actingRoutes;
