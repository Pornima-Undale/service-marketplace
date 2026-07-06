import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarketplaceServiceService } from '../../../core/services/marketplace-service.service';
import { ReviewService } from '../../../core/services/review.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { RatingResponse, ReviewResponse, ServiceResponse } from '../../../core/models/models';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private serviceApi = inject(MarketplaceServiceService);
  private reviewApi = inject(ReviewService);
  private bookingApi = inject(BookingService);
  public auth = inject(AuthService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  service = signal<ServiceResponse | null>(null);
  reviews = signal<ReviewResponse[]>([]);
  rating = signal<RatingResponse | null>(null);
  loading = signal(true);
  notFound = signal(false);

  showBookingForm = signal(false);
  bookingLoading = signal(false);
  bookingSuccess = signal(false);

  showReviewForm = signal(false);
  reviewLoading = signal(false);
  hoverStar = signal(0);

  bookingForm = this.fb.group({
    bookingDate: ['', [Validators.required]]
  });

  reviewForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(3)]]
  });

  minDate = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.notFound.set(true); this.loading.set(false); return; }

    this.serviceApi.getAll().subscribe({
      next: services => {
        const found = services.find(s => s.id === id) ?? null;
        this.service.set(found);
        this.notFound.set(!found);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.notFound.set(true); }
    });

    this.reviewApi.getByService(id).subscribe({
      next: reviews => this.reviews.set(reviews),
      error: () => {}
    });

    this.reviewApi.getRating(id).subscribe({
      next: rating => this.rating.set(rating),
      error: () => {}
    });
  }

  starsArray(count: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(count) ? 1 : 0);
  }

  toggleBookingForm(): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.info('Please log in as a customer to book this service.');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.auth.role() !== 'CUSTOMER') {
      this.toast.error('Only customer accounts can book services.');
      return;
    }
    this.showBookingForm.update(v => !v);
  }

  submitBooking(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    const svc = this.service();
    if (!svc) return;

    this.bookingLoading.set(true);
    this.bookingApi.create({
      serviceId: svc.id,
      bookingDate: this.bookingForm.value.bookingDate!
    }).subscribe({
      next: () => {
        this.bookingLoading.set(false);
        this.bookingSuccess.set(true);
        this.showBookingForm.set(false);
        this.toast.success('Booking request sent! Track it under My Bookings.');
      },
      error: () => {
        this.bookingLoading.set(false);
        this.toast.error('Could not create booking. Please try again.');
      }
    });
  }

  toggleReviewForm(): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.info('Please log in to leave a review.');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.showReviewForm.update(v => !v);
  }

  setRating(value: number): void {
    this.reviewForm.patchValue({ rating: value });
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    const svc = this.service();
    if (!svc) return;

    this.reviewLoading.set(true);
    this.reviewApi.create({
      rating: this.reviewForm.value.rating!,
      comment: this.reviewForm.value.comment!,
      service: { id: svc.id }
    }).subscribe({
      next: () => {
        this.reviewLoading.set(false);
        this.showReviewForm.set(false);
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.toast.success('Thanks for your review!');
        this.reviewApi.getByService(svc.id).subscribe(r => this.reviews.set(r));
        this.reviewApi.getRating(svc.id).subscribe(r => this.rating.set(r));
      },
      error: () => {
        this.reviewLoading.set(false);
        this.toast.error('Could not submit review. Please try again.');
      }
    });
  }
}
