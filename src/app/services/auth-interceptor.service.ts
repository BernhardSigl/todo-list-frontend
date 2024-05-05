import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptorService: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('token');

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Token ${authToken}`
    }
  });

  return next(authReq).pipe(     
    catchError( (err) => {
      if(err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          window.location.href = '/login';
        }
      }
      return throwError( () => err )
    })
  );
};