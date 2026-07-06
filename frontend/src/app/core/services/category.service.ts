import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServiceCategory } from '../models/models';

const STORAGE_KEY = 'localpro_categories_cache';

/**
 * NOTE ON BACKEND LIMITATION:
 * The backend only exposes POST /categories (create) — there is no GET endpoint
 * to list existing categories. To keep category selection usable in the UI,
 * this service keeps a local cache of every category created through this app
 * (id + name) in localStorage, so it can be reused for service-creation dropdowns.
 * Category *filtering* on the Browse Services page does not depend on this cache —
 * it derives category names directly from the services already returned by the API.
 */
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly base = `${environment.apiUrl}/categories`;

  private _cache = signal<ServiceCategory[]>(this.readCache());
  readonly categories = computed(() => this._cache());

  constructor(private http: HttpClient) {}

  create(name: string): Observable<ServiceCategory> {
    return this.http.post<ServiceCategory>(this.base, { name }).pipe(
      tap(category => this.addToCache(category))
    );
  }

  addToCache(category: ServiceCategory): void {
    const existing = this._cache().find(c => c.name.toLowerCase() === category.name.toLowerCase());
    if (existing) return;
    const updated = [...this._cache(), category].sort((a, b) => a.name.localeCompare(b.name));
    this._cache.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  private readCache(): ServiceCategory[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
