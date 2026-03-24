import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';
import { TuiToastService } from '@taiga-ui/kit';

export const authGuard: CanActivateFn = () => {
  const appwrite = inject(AppwriteService);
  if (appwrite.loggedInUser()) {
    return true;
  }
  const toast = inject(TuiToastService);
  toast.open('You must be logged in to access this page.');
  return false;
};
