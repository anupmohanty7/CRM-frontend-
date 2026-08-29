
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  /*
   * Login must NOT receive the old JWT.
   * The purpose of this request is to get a new JWT.
   */
  if (
  req.url.endsWith('/api/auth/login') ||
  req.url.endsWith('/api/auth/register')
) {
  return next(req);
}

  const token = authService.getToken();

  /*
   * No JWT available.
   * Send the request normally.
   */
  if (!token) {
    return next(req);
  }

  /*
   * Add JWT to normal authenticated requests.
   */
  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  /*
   * If the JWT is expired or invalid,
   * remove it and send the user back to login.
   */
  return next(authRequest).pipe(
    catchError(error => {

      if (error.status === 401) {
        authService.removeToken();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};

