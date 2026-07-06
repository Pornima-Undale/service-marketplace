import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'LocalPro — Find Trusted Local Services'
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/service-list/service-list.component').then(m => m.ServiceListComponent),
    title: 'Browse Services — LocalPro'
  },
  {
    path: 'services/:id',
    loadComponent: () => import('./features/services/service-detail/service-detail.component').then(m => m.ServiceDetailComponent),
    title: 'Service Details — LocalPro'
  },
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Log In — LocalPro'
  },
  {
    path: 'auth/register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Create Account — LocalPro'
  },
  {
    path: 'my-bookings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bookings/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
    title: 'My Bookings — LocalPro'
  },
  {
    path: 'provider/dashboard',
    canActivate: [roleGuard(['PROVIDER'])],
    loadComponent: () => import('./features/provider/provider-dashboard/provider-dashboard.component').then(m => m.ProviderDashboardComponent),
    title: 'Provider Dashboard — LocalPro'
  },
  {
    path: 'provider/services/new',
    canActivate: [roleGuard(['PROVIDER'])],
    loadComponent: () => import('./features/services/service-form/service-form.component').then(m => m.ServiceFormComponent),
    title: 'Add Service — LocalPro'
  },
  {
    path: 'provider/services/:id/edit',
    canActivate: [roleGuard(['PROVIDER'])],
    loadComponent: () => import('./features/services/service-form/service-form.component').then(m => m.ServiceFormComponent),
    title: 'Edit Service — LocalPro'
  },
  {
    path: 'provider/profile',
    canActivate: [roleGuard(['PROVIDER'])],
    loadComponent: () => import('./features/provider/provider-profile-setup/provider-profile-setup.component').then(m => m.ProviderProfileSetupComponent),
    title: 'Business Profile — LocalPro'
  },
  {
    path: 'provider/bookings',
    canActivate: [roleGuard(['PROVIDER'])],
    loadComponent: () => import('./features/bookings/provider-bookings/provider-bookings.component').then(m => m.ProviderBookingsComponent),
    title: 'Booking Requests — LocalPro'
  },
  {
    path: 'admin/users',
    canActivate: [roleGuard(['ADMIN'])],
    loadComponent: () => import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
    title: 'Manage Users — LocalPro'
  },
  {
    path: 'admin/categories',
    canActivate: [roleGuard(['ADMIN'])],
    loadComponent: () => import('./features/admin/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent),
    title: 'Manage Categories — LocalPro'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found — LocalPro'
  }
];
