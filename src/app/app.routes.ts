import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

/** Functional guard: requires authenticated user */
const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.loading()) return true;
  if (!auth.user()) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
  return true;
};

/** Functional guard: redirects authenticated users away from guest pages */
const guestGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.loading()) return true;
  if (auth.user()) {
    router.navigate(['/'], { replaceUrl: true });
    return false;
  }
  return true;
};

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
