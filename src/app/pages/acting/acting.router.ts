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
        path: 'step-6',
        loadComponent: () => import('./steps/step-6'),
      },
      {
        path: 'step-7',
        loadComponent: () => import('./steps/step-7'),
      },
      {
        path: 'step-8',
        loadComponent: () => import('./steps/step-8'),
      },
      {
        path: 'step-9',
        loadComponent: () => import('./steps/step-9'),
      },
      {
        path: 'step-10',
        loadComponent: () => import('./steps/step-10'),
      },
      {
        path: 'step-11',
        loadComponent: () => import('./steps/step-11'),
      },
      {
        path: 'step-12',
        loadComponent: () => import('./steps/step-12'),
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
