import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';
import { environment } from '../environments/environment';
import { TuiToastService } from '@taiga-ui/kit';

export const authGuard: CanActivateFn = () => {
  const appwrite = inject(AppwriteService);
  const toast = inject(TuiToastService);
  // Use a computed signal to react to login state
  if (!environment.production) {
    toast.open('Checking authentication status...' + !!appwrite.loggedInUser());
  }
  if (!!appwrite.loggedInUser()) {
    // User is logged in, access granted
    return true;
  } else {
    // User is not logged in, access denied
    toast.open('You must be logged in to access this page.');
    return false;
  }
};
