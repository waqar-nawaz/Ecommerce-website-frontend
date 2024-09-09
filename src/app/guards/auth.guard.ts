import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isAuthenticated()) {
    return true;
  } else {
    setTimeout(() => {
      inject(Router).navigateByUrl('/login');
    }, 100);

    return false;
  }
};
