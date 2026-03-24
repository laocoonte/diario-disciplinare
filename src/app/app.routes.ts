import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const navRoutes: Routes = [
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar').then((m) => m.Calendar),
    canActivate: [authGuard],
    data: { title: 'Calendar' },
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/tasks/tasks').then((m) => m.Tasks),
    canActivate: [authGuard],
    data: { title: 'Tasks' },
  },
  {
    path: 'observe',
    loadComponent: () => import('./pages/observe/observe').then((m) => m.Observe),
    canActivate: [authGuard],
    data: { title: 'Observe' },
  },
];

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    data: { title: 'Login' },
  },
  ...navRoutes,
  { path: '**', redirectTo: 'login' },
];
