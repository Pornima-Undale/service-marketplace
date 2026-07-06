import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceServiceService } from '../../core/services/marketplace-service.service';
import { ServiceResponse } from '../../core/models/models';

interface Category {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchTerm = '';
  featured = signal<ServiceResponse[]>([]);
  loading = signal(true);

  categories: Category[] = [
    { name: 'Home Cleaning', icon: 'M3 21h18M9 8h6m-6 4h6m-6 4h6M5 21V8l7-5 7 5v13' },
    { name: 'Plumbing', icon: 'M9 3h6v4l4 4v10H5V11l4-4V3z' },
    { name: 'Electrical', icon: 'M13 2L3 14h6l-1 8 10-12h-6l1-8z' },
    { name: 'Appliance Repair', icon: 'M4 4h16v10H4zM8 20h8M10 14v6m4-6v6' },
    { name: 'Painting', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM9 12h6' },
    { name: 'Tutoring', icon: 'M12 4l9 5-9 5-9-5 9-5zm-9 8l9 5 9-5' }
  ];

  steps = [
    { title: 'Search & Compare', desc: 'Browse verified providers by category, price, or rating near you.' },
    { title: 'Book Instantly', desc: 'Pick a convenient date and confirm your booking in a few taps.' },
    { title: 'Get It Done', desc: 'Your provider arrives, completes the job, and you rate the experience.' }
  ];

  constructor(private serviceApi: MarketplaceServiceService, private router: Router) {}

  ngOnInit(): void {
    this.serviceApi.getAll().subscribe({
      next: services => {
        this.featured.set(services.slice(0, 6));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void {
    this.router.navigate(['/services'], {
      queryParams: this.searchTerm ? { q: this.searchTerm } : {}
    });
  }

  browseCategory(name: string): void {
    this.router.navigate(['/services'], { queryParams: { category: name } });
  }
}
