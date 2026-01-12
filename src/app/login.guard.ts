import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppwriteService } from './services/appwrite.service';
import { ToastService } from './components/toast/toast.service';

export const loginGuard: CanActivateFn = () => {
  const appwrite = inject(AppwriteService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  // Use a computed signal to react to login state
  console.log('🚀 ~ loginGuard ~ appwrite.loggedInUser():', appwrite.loggedInUser());
  if (!!appwrite.loggedInUser()) {
    router.navigate(['/calendar']);
  }
  return true;
};
