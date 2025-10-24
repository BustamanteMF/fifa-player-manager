import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private base = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  login(payload: { email: string; password: string }): Observable<{ token: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ token: string }>(`${this.base}/login`, payload, { headers, withCredentials: true });
  }  
}
