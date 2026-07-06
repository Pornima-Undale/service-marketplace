import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServicePayload, ServiceResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MarketplaceServiceService {
  private readonly base = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(this.base);
  }

  getByCategory(name: string): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(`${this.base}/category/${name}`);
  }

  getByPriceRange(min: number, max: number): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(`${this.base}/price`, {
      params: { min, max }
    });
  }

  getByProvider(providerId: number): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(`${this.base}/provider/${providerId}`);
  }

  create(payload: ServicePayload): Observable<any> {
    return this.http.post(this.base, payload);
  }

  update(id: number, payload: ServicePayload): Observable<any> {
    return this.http.put(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.base}/${id}`, { responseType: 'text' });
  }
}
