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
        path: 'track-review',
        loadComponent: () => import('./pages/track-review.page'),
      },
      {
        path: 'perimeter-review',
        loadComponent: () => import('./pages/perimeter-review.page'),
      },
      {
        path: 'dog-review',
        loadComponent: () => import('./pages/dog-review/dog-review.page'),
      },
      {
        path: 'marking-flight',
        loadComponent: () => import('./pages/marking-flight.page'),
      },
      {
        path: 'reports',
        loadComponent: () => import('../reports/reports.page'),
      },
    ],
  },
];
export default preventionRoutes;
