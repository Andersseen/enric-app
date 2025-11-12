import { Routes } from '@angular/router';

const actingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./acting.page'),
    children: [
      {
        path: 'step-1',
        loadComponent: () => import('./steps/zones'),
      },
      {
        path: 'step-2',
        loadComponent: () => import('./steps/list'),
      },

      {
        path: '',
        redirectTo: 'action/step-1',
        pathMatch: 'full',
      },
    ],
  },
  // { path: 'new', loadComponent: () => import('./new/new.page') },
  // { path: 'edit', loadComponent: () => import('./edit/edit.page') },
  // { path: 'comments', loadComponent: () => import('./comments/page') },
];
export default actingRoutes;
