import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/models';
import { ToastService } from '../services/toast.service';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const toast = inject(ToastService);

    if (!auth.isLoggedIn()) {
      router.navigate(['/auth/login']);
      return false;
    }

    if (auth.role() && allowedRoles.includes(auth.role()!)) {
      return true;
    }

    toast.error("You don't have access to that page.");
    router.navigate(['/']);
    return false;
  };
};
