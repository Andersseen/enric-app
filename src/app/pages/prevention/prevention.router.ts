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
        loadChildren: () => import('./pages/dog-review/dog-review.routes'),
      },
      {
        path: 'marking-flight',
        loadComponent: () => import('./pages/marking-flight.page'),
      },
    ],
  },
];
export default preventionRoutes;
