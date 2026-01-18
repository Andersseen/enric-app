import { Routes } from '@angular/router';

const dogReviewRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dog-review.page'),
    children: [
      {
        path: 'step-1',
        loadComponent: () => import('./step-1'),
      },
      {
        path: 'step-2',
        loadComponent: () => import('./step-2'),
      },
      {
        path: 'step-3',
        loadComponent: () => import('./step-3'),
      },

      {
        path: '',
        redirectTo: 'step-1',
        pathMatch: 'full',
      },
    ],
  },
];
export default dogReviewRoutes;
