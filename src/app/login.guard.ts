import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';

export const loginGuard: CanActivateFn = () => {
  const appwrite = inject(AppwriteService);
  if (appwrite.loggedInUser()) {
    inject(Router).navigate(['/calendar']);
  }
  return true;
};
