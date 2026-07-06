import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProviderProfileService } from '../../../core/services/provider-profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ProviderProfile } from '../../../core/models/models';

@Component({
  selector: 'app-provider-profile-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './provider-profile-setup.component.html',
  styleUrl: './provider-profile-setup.component.scss'
})
export class ProviderProfileSetupComponent implements OnInit {
  private fb = inject(FormBuilder);
  private providerApi = inject(ProviderProfileService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(false);
  existingProfile = signal<ProviderProfile | null>(null);

  form = this.fb.group({
    userId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    businessName: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    latitude: [''],
    longitude: ['']
  });

  ngOnInit(): void {
    const email = this.auth.currentUser()?.email;
    if (email) {
      const cached = this.providerApi.getCachedProfile(email);
      if (cached) this.existingProfile.set(cached);
    }
  }

  get userId() { return this.form.get('userId')!; }
  get businessName() { return this.form.get('businessName')!; }
  get description() { return this.form.get('description')!; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.auth.currentUser()?.email;
    if (!email) return;

    const raw = this.form.getRawValue();
    const payload: ProviderProfile = {
      businessName: raw.businessName!,
      description: raw.description!,
      latitude: raw.latitude ? Number(raw.latitude) : undefined,
      longitude: raw.longitude ? Number(raw.longitude) : undefined,
      user: { id: Number(raw.userId) }
    };

    this.loading.set(true);
    this.providerApi.create(payload, email).subscribe({
      next: profile => {
        this.loading.set(false);
        this.existingProfile.set(profile);
        this.toast.success('Business profile created! You can now add services.');
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 500) {
          this.toast.error('That user ID may already have a profile, or may not exist. Double-check the ID and try again.');
        } else {
          this.toast.error('Could not create profile. Please try again.');
        }
      }
    });
  }

  startOver(): void {
    this.existingProfile.set(null);
  }
}
