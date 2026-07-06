import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toast = inject(ToastService);
  const router = inject(Router);

  const token = authService.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        toast.error(error.status === 401
          ? 'Your session has expired. Please log in again.'
          : "You don't have permission to do that.");
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/auth/login']);
        }
      } else if (error.status === 0) {
        toast.error('Cannot reach the server. Is the backend running on port 8080?');
      } else if (error.status >= 500) {
        toast.error('Something went wrong on the server. Please try again.');
      }
      return throwError(() => error);
    })
  );
};
