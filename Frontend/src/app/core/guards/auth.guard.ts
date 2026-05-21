import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If a token exists, allow navigation
  if (authService.getToken()) {
    return true;
  }

  // Otherwise, redirect to the login page
  return router.createUrlTree(['/login']);
};
