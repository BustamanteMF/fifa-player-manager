import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Auth {
  private base = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  login(payload: { email: string; password: string }) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ token: string; refreshToken?: string }>(`${this.base}/login`, payload, { headers, withCredentials: true })
      .pipe(
        tap((res: any) => {
          if (res && res.token) {
            localStorage.setItem('token', res.token);
          }
          if (res?.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
        })
      );
  }  

  refresh(refreshToken: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ token: string }>(`${this.base}/refresh`, { refreshToken }, { headers, withCredentials: true });
  }
}
