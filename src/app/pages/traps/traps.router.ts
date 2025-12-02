import { Routes } from '@angular/router';

const trapsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./traps.page'),
    children: [
      {
        path: 'step-1',
        loadComponent: () => import('./steps/step-1'),
      },
      {
        path: '',
        redirectTo: 'step-1',
        pathMatch: 'full',
      },
    ],
  },
];
export default trapsRoutes;
