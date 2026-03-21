import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home.router') },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.page'),
  },
  {
    path: 'reporte-entero',
    loadComponent: () => import('./pages/reports/full-report.page'),
  },
];
