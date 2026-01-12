import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';
import { ToastService } from './components/toast/toast.service';
import { environment } from '../environments/environment';

export const authGuard: CanActivateFn = () => {
  const appwrite = inject(AppwriteService);
  const toastService = inject(ToastService);
  // Use a computed signal to react to login state
  if (!environment.production) {
    toastService.show('Checking authentication status...' + !!appwrite.loggedInUser());
  }
  if (!!appwrite.loggedInUser()) {
    // User is logged in, access granted
    return true;
  } else {
    // User is not logged in, access denied
    toastService.show('You must be logged in to access this page.');
    return false;
  }
};
