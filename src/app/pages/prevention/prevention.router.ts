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
        loadComponent: () => import('./prevention-detail.page'),
        data: { title: 'Observación' },
      },
      {
        path: 'track-review',
        loadComponent: () => import('./prevention-detail.page'),
        data: { title: 'Revisión pista' },
      },
      {
        path: 'perimeter-review',
        loadComponent: () => import('./prevention-detail.page'),
        data: { title: 'Revisión perimetral' },
      },
      {
        path: 'dog-review',
        loadComponent: () => import('./prevention-detail.page'),
        data: { title: 'Revisión perro' },
      },
      {
        path: 'marking-flight',
        loadComponent: () => import('./prevention-detail.page'),
        data: { title: 'Vuelo de marcaje' },
      },
      {
        path: 'traps-placement',
        loadComponent: () => import('./prevention-detail.page'),
        data: { title: 'Colocación trampas' },
      },
    ],
  },
];
export default preventionRoutes;
