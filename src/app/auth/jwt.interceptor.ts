import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authToken = this.authService.getAuthToken();

    if (authToken) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {

          console.error(error)
          if (error.status === 401) {
            // Token exp.
            this.authService.logout(); 
            this.router.navigate(['/login']); 
          }
          return throwError(() => error);
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
