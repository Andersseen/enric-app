import { Routes } from '@angular/router';

const reviewsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./reviews.page'),
  },
  { path: 'new', loadComponent: () => import('./new/new.page') },
  // { path: 'edit', loadComponent: () => import('./reviews/reviews.page') },
];
export default reviewsRoutes;
