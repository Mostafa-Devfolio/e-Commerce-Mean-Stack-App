import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  // Check if the decoded JWT payload specifically has the admin role
  if (user && user.role === 'admin') {
    return true;
  }

  // Otherwise, kick them back to the public homepage
  return router.createUrlTree(['/']);
};
