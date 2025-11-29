import { Routes } from '@angular/router';

const actingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./acting.page'),
    children: [
      {
        path: 'step-1',
        loadComponent: () => import('./steps/step-1'),
      },
      {
        path: 'step-2',
        loadComponent: () => import('./steps/step-2'),
      },
      {
        path: 'step-3',
        loadComponent: () => import('./steps/step-3'),
      },
      {
        path: 'step-4',
        loadComponent: () => import('./steps/step-4'),
      },
      {
        path: 'step-5',
        loadComponent: () => import('./steps/step-5'),
      },
      {
        path: '',
        redirectTo: 'step-1',
        pathMatch: 'full',
      },
    ],
  },

  // { path: 'new', loadComponent: () => import('./new/new.page') },
  // { path: 'edit', loadComponent: () => import('./edit/edit.page') },
  // { path: 'comments', loadComponent: () => import('./comments/page') },
];
export default actingRoutes;
