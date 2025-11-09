import { Routes } from '@angular/router';

const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.page'),
    children: [
      { path: '', loadComponent: () => import('./list.page') },
      { path: 'action', loadChildren: () => import('./acting/acting.router') },
      { path: 'prevention', loadChildren: () => import('./prevention/prevention.router') },
    ],
  },
];
export default homeRoutes;
