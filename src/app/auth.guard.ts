import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppwriteService } from './appwrite.service';
import { computed } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const appwrite = inject(AppwriteService);
  const router = inject(Router);
  // Use a computed signal to react to login state
  if (!!appwrite.loggedInUser()) {
    console.log('User is logged in, access granted.');
    return true;
  } else {
    console.log('User is not logged in, access denied.');
    router.navigate(['/login']);
    return false;
  }
};
