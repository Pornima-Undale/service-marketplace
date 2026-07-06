import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  constructor(
    public auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  closeMenus(): void {
    this.mobileMenuOpen.set(false);
    this.userMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.closeMenus();
    this.toast.success('You have been logged out.');
    this.router.navigate(['/']);
  }

  initials(email: string | undefined): string {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  }
}
