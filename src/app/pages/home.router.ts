import { Routes } from '@angular/router';

const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.page'),
  },
  { path: 'wildlife', loadComponent: () => import('./wildlife/wildlife.page') },
  { path: 'reviews', loadChildren: () => import('./reviews/reviews.router') },
];
export default homeRoutes;
