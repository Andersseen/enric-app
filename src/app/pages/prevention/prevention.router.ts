import { Routes } from '@angular/router';

const preventionRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./prevention.page'),
    children: [
      {
        path: '',
        loadComponent: () => import('./prevention-list.page'),
      },
      {
        path: 'observation',
        loadComponent: () => import('./pages/observation.page'),
      },
      {
        path: 'track-review',
        loadComponent: () => import('./pages/track-review.page'),
      },
      {
        path: 'perimeter-review',
        loadComponent: () => import('./pages/perimeter-review.page'),
      },
      {
        path: 'dog-review',
        loadComponent: () => import('./pages/dog-review.page'),
      },
      {
        path: 'marking-flight',
        loadComponent: () => import('./pages/marking-flight.page'),
      },
      {
        path: 'traps-placement',
        loadComponent: () => import('./pages/traps-placement.page'),
      },
    ],
  },
];
export default preventionRoutes;
