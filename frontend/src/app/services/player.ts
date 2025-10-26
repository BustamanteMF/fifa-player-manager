import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Player {
  private base = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) {}

  // filters: { name, position, team, minRating, maxRating, page, limit, sortBy, sortDir }
  getPlayers(filters: Record<string, any> = {}): Observable<{ rows: any[]; count: number; page: number; totalPages: number }> {
    let params = new HttpParams();
    Object.keys(filters).forEach(k => {
      const v = filters[k];
      if (v !== null && v !== undefined && v !== '') {
        params = params.set(k, String(v));
      }
    });

    // si usás cookies/sesión, mantené withCredentials: true; si usás token y un interceptor, no es necesario
    return this.http.get<{ rows: any[]; count: number; page: number; totalPages: number }>(this.base, {
      params,
      withCredentials: true
    });
  }

  getPlayerById(id: number) {
    return this.http.get(`${this.base}/${id}`, { withCredentials: true });
  }

  // otros métodos (create/update/delete) si los necesitás...
}
