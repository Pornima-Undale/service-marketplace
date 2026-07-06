import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MarketplaceServiceService } from '../../../core/services/marketplace-service.service';
import { CategoryService } from '../../../core/services/category.service';
import { ProviderProfileService } from '../../../core/services/provider-profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private serviceApi = inject(MarketplaceServiceService);
  public categoryApi = inject(CategoryService);
  private providerApi = inject(ProviderProfileService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  isEdit = signal(false);
  serviceId = signal<number | null>(null);
  loading = signal(false);
  pageLoading = signal(true);
  hasProfile = signal(false);
  addingCategory = signal(false);
  newCategoryName = '';
  addCategoryLoading = signal(false);

  categories = this.categoryApi.categories;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: ['', [Validators.required, Validators.min(1)]],
    categoryId: ['', [Validators.required]]
  });

  private providerId: number | null = null;

  ngOnInit(): void {
    const email = this.auth.currentUser()?.email;
    const profile = email ? this.providerApi.getCachedProfile(email) : null;

    if (!profile?.id) {
      this.hasProfile.set(false);
      this.pageLoading.set(false);
      return;
    }
    this.hasProfile.set(true);
    this.providerId = profile.id;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit.set(true);
      const id = Number(idParam);
      this.serviceId.set(id);
      this.serviceApi.getAll().subscribe({
        next: services => {
          const svc = services.find(s => s.id === id);
          if (svc) {
            const matchedCategory = this.categories().find(c => c.name.toLowerCase() === svc.categoryName?.toLowerCase());
            this.form.patchValue({
              title: svc.title,
              description: svc.description,
              price: String(svc.price),
              categoryId: matchedCategory ? String(matchedCategory.id) : ''
            });
          }
          this.pageLoading.set(false);
        },
        error: () => { this.pageLoading.set(false); this.toast.error('Could not load this service.'); }
      });
    } else {
      this.pageLoading.set(false);
    }
  }

  get title() { return this.form.get('title')!; }
  get description() { return this.form.get('description')!; }
  get price() { return this.form.get('price')!; }
  get categoryId() { return this.form.get('categoryId')!; }

  toggleAddCategory(): void {
    this.addingCategory.update(v => !v);
    this.newCategoryName = '';
  }

  submitNewCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    this.addCategoryLoading.set(true);
    this.categoryApi.create(name).subscribe({
      next: category => {
        this.addCategoryLoading.set(false);
        this.addingCategory.set(false);
        this.form.patchValue({ categoryId: String(category.id) });
        this.toast.success(`Category "${category.name}" added.`);
      },
      error: () => {
        this.addCategoryLoading.set(false);
        this.toast.error('Could not create category.');
      }
    });
  }

  submit(): void {
    if (this.form.invalid || !this.providerId) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload = {
      title: raw.title!,
      description: raw.description!,
      price: Number(raw.price),
      category: { id: Number(raw.categoryId) },
      provider: { id: this.providerId }
    };

    this.loading.set(true);
    const request = this.isEdit()
      ? this.serviceApi.update(this.serviceId()!, payload)
      : this.serviceApi.create(payload);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success(this.isEdit() ? 'Service updated.' : 'Service listed successfully!');
        this.router.navigate(['/provider/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Could not save this service. Please try again.');
      }
    });
  }
}
