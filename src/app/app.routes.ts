import { Routes } from '@angular/router';
import { Calendar } from './pages/calendar/calendar';
import { Login } from './pages/login/login';
import { Tasks } from './pages/tasks/tasks';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'calendar', component: Calendar, canActivate: [authGuard] },
  { path: 'tasks', component: Tasks, canActivate: [authGuard] },
];
