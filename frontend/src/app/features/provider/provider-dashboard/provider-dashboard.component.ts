import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketplaceServiceService } from '../../../core/services/marketplace-service.service';
import { ProviderProfileService } from '../../../core/services/provider-profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ServiceResponse } from '../../../core/models/models';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.scss'
})
export class ProviderDashboardComponent implements OnInit {
  hasProfile = signal(false);
  services = signal<ServiceResponse[]>([]);
  loading = signal(true);
  deletingId = signal<number | null>(null);

  avgPrice = computed(() => {
    const list = this.services();
    if (!list.length) return 0;
    return list.reduce((sum, s) => sum + (s.price ?? 0), 0) / list.length;
  });

  constructor(
    private serviceApi: MarketplaceServiceService,
    private providerApi: ProviderProfileService,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const email = this.auth.currentUser()?.email;
    const profile = email ? this.providerApi.getCachedProfile(email) : null;

    if (!profile?.id) {
      this.hasProfile.set(false);
      this.loading.set(false);
      return;
    }

    this.hasProfile.set(true);
    this.serviceApi.getByProvider(profile.id).subscribe({
      next: services => { this.services.set(services); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Could not load your services.'); }
    });
  }

  deleteService(id: number): void {
    if (!confirm('Delete this service listing? This cannot be undone.')) return;
    this.deletingId.set(id);
    this.serviceApi.delete(id).subscribe({
      next: () => {
        this.services.update(list => list.filter(s => s.id !== id));
        this.deletingId.set(null);
        this.toast.success('Service deleted.');
      },
      error: () => {
        this.deletingId.set(null);
        this.toast.error('Could not delete this service.');
      }
    });
  }
}
