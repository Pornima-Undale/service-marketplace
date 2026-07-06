import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProviderProfile } from '../models/models';

const PROFILE_KEY_PREFIX = 'localpro_provider_profile_';

@Injectable({ providedIn: 'root' })
export class ProviderProfileService {
  private readonly base = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) {}

  create(payload: ProviderProfile, email: string): Observable<ProviderProfile> {
    return this.http.post<ProviderProfile>(this.base, payload).pipe(
      tap(profile => this.cacheProfile(email, profile))
    );
  }

  cacheProfile(email: string, profile: ProviderProfile): void {
    localStorage.setItem(PROFILE_KEY_PREFIX + email, JSON.stringify(profile));
  }

  getCachedProfile(email: string): ProviderProfile | null {
    const raw = localStorage.getItem(PROFILE_KEY_PREFIX + email);
    return raw ? JSON.parse(raw) : null;
  }
}
