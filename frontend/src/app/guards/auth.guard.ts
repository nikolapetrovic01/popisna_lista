import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const authToken = localStorage.getItem('authToken');
  const userLevel = localStorage.getItem('userLevel');

  if (!authToken) {
    router.navigate(['/login']);
    return false;
  }

  const requiredLevel = route.data?.['requiredLevel'];

  if (requiredLevel != undefined && Number(userLevel) < requiredLevel) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
