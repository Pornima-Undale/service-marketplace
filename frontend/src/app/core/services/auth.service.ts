import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, DecodedToken, LoginRequest, LoginResponse, RegisterRequest, Role } from '../models/models';

const TOKEN_KEY = 'localpro_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  private _currentUser = signal<AuthUser | null>(this.readUserFromStorage());
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoggedIn = computed(() => !!this._currentUser());
  readonly role = computed<Role | null>(() => this._currentUser()?.role ?? null);

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap(res => this.setSession(res.token))
    );
  }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, payload).pipe(
      tap(res => this.setSession(res.token))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setSession(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this._currentUser.set(this.buildUserFromToken(token));
  }

  private readUserFromStorage(): AuthUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const user = this.buildUserFromToken(token);
    if (user && this.isExpired(user.token)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return user;
  }

  private buildUserFromToken(token: string): AuthUser | null {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;
    return { email: decoded.sub, role: decoded.role, token };
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = decodeURIComponent(
        atob(normalized)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(decoded) as DecodedToken;
    } catch {
      return null;
    }
  }

  private isExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    return decoded.exp * 1000 < Date.now();
  }
}
