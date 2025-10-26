import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((err) => {
        // If token expired, try to refresh it using refresh token
        if (err.status === 401 && err.error && err.error.error === 'token_expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            // no refresh token available – force logout
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return throwError(() => err);
          }

          const http = this.injector.get(HttpClient);
          return http.post<any>('http://localhost:3000/api/auth/refresh', { refreshToken }).pipe(
            switchMap((res) => {
              if (res && res.token) {
                localStorage.setItem('token', res.token);
                // retry original request with new token
                const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } });
                return next.handle(retryReq);
              }
              // refresh didn't return token: force logout
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return throwError(() => err);
            }),
            catchError((refreshErr) => {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return throwError(() => refreshErr);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
