import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BookingRequest, BookingResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly base = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(this.base);
  }

  create(payload: BookingRequest): Observable<any> {
    return this.http.post(this.base, payload);
  }

  accept(id: number): Observable<any> {
    return this.http.put(`${this.base}/${id}/accept`, {});
  }

  complete(id: number): Observable<any> {
    return this.http.put(`${this.base}/${id}/complete`, {});
  }
}
