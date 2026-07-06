import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RatingResponse, ReviewPayload, ReviewResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly base = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(this.base);
  }

  getByService(serviceId: number): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.base}/service/${serviceId}`);
  }

  getRating(serviceId: number): Observable<RatingResponse> {
    return this.http.get<RatingResponse>(`${this.base}/service/${serviceId}/rating`);
  }

  create(payload: ReviewPayload): Observable<any> {
    return this.http.post(this.base, payload);
  }
}
