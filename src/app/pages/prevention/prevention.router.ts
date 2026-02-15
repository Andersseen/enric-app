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
        children: [
          {
            path: 'step-1',
            loadComponent: () => import('./steps/track-review-step'),
          },
          {
            path: '',
            redirectTo: 'step-1',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'perimeter-review',
        children: [
          {
            path: 'step-1',
            loadComponent: () => import('./steps/perimeter-review-step'),
          },
          {
            path: '',
            redirectTo: 'step-1',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'dog-review',
        children: [
          {
            path: 'step-1',
            loadComponent: () => import('./steps/dog-review/step-1'),
          },
          {
            path: 'step-2',
            loadComponent: () => import('./steps/dog-review/step-2'),
          },
          {
            path: '',
            redirectTo: 'step-1',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'marking-flight',
        children: [
          {
            path: 'step-1',
            loadComponent: () => import('./steps/marking-flight/step-1'),
          },
          {
            path: 'step-2',
            loadComponent: () => import('./steps/marking-flight/step-2'),
          },
          {
            path: 'step-3',
            loadComponent: () => import('./steps/marking-flight/step-3'),
          },
          {
            path: 'step-4',
            loadComponent: () => import('./steps/marking-flight/step-4'),
          },
          {
            path: '',
            redirectTo: 'step-1',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
];
export default preventionRoutes;
