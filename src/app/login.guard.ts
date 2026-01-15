import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';
import { TuiToastService } from '@taiga-ui/kit';

export const loginGuard: CanActivateFn = () => {
  const appwrite = inject(AppwriteService);
  const router = inject(Router);
  const toast = inject(TuiToastService);
  // Use a computed signal to react to login state
  if (!!appwrite.loggedInUser()) {
    router.navigate(['/calendar']);
  }
  return true;
};
