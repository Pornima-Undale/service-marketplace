import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceServiceService } from '../../../core/services/marketplace-service.service';
import { ServiceResponse } from '../../../core/models/models';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'title-asc';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent implements OnInit {
  allServices = signal<ServiceResponse[]>([]);
  loading = signal(true);
  errorMsg = signal<string | null>(null);

  searchTerm = signal('');
  selectedCategory = signal<string>('All');
  maxPrice = signal<number>(0);
  priceCeiling = signal<number>(0);
  sortOption = signal<SortOption>('default');

  categories = computed(() => {
    const names = new Set(this.allServices().map(s => s.categoryName).filter(Boolean));
    return ['All', ...Array.from(names).sort()];
  });

  filtered = computed(() => {
    let list = this.allServices();
    const term = this.searchTerm().trim().toLowerCase();
    if (term) {
      list = list.filter(s =>
        s.title?.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term) ||
        s.categoryName?.toLowerCase().includes(term) ||
        s.providerName?.toLowerCase().includes(term)
      );
    }
    if (this.selectedCategory() !== 'All') {
      list = list.filter(s => s.categoryName === this.selectedCategory());
    }
    if (this.maxPrice() > 0) {
      list = list.filter(s => (s.price ?? 0) <= this.maxPrice());
    }

    const sorted = [...list];
    switch (this.sortOption()) {
      case 'price-asc': sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
      case 'price-desc': sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      case 'title-asc': sorted.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')); break;
    }
    return sorted;
  });

  constructor(private serviceApi: MarketplaceServiceService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const q = params.get('q');
    const category = params.get('category');
    if (q) this.searchTerm.set(q);

    this.serviceApi.getAll().subscribe({
      next: services => {
        this.allServices.set(services);
        const max = Math.max(0, ...services.map(s => s.price ?? 0));
        this.priceCeiling.set(Math.ceil(max / 100) * 100 || 5000);

        if (category) {
          const match = services.find(s => s.categoryName?.toLowerCase() === category.toLowerCase());
          this.selectedCategory.set(match ? match.categoryName : 'All');
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Could not load services. Please check that the backend server is running.');
      }
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('All');
    this.maxPrice.set(0);
    this.sortOption.set('default');
  }
}
