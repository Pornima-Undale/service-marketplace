import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { BookingResponse, BookingStatus } from '../../../core/models/models';

@Component({
  selector: 'app-provider-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-bookings.component.html',
  styleUrl: './provider-bookings.component.scss'
})
export class ProviderBookingsComponent implements OnInit {
  bookings = signal<BookingResponse[]>([]);
  loading = signal(true);
  errorMsg = signal<string | null>(null);
  actingId = signal<number | null>(null);
  filterStatus = signal<BookingStatus | 'ALL'>('ALL');

  statusTabs: (BookingStatus | 'ALL')[] = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'];

  filtered = computed(() => {
    if (this.filterStatus() === 'ALL') return this.bookings();
    return this.bookings().filter(b => b.status === this.filterStatus());
  });

  constructor(private bookingApi: BookingService, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.bookingApi.getAll().subscribe({
      next: bookings => { this.bookings.set(bookings); this.loading.set(false); },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Could not load booking requests. Please check the backend connection.');
      }
    });
  }

  badgeClass(status: BookingStatus): string {
    return {
      PENDING: 'badge-pending',
      ACCEPTED: 'badge-accepted',
      COMPLETED: 'badge-completed',
      CANCELLED: 'badge-cancelled'
    }[status];
  }

  accept(booking: BookingResponse): void {
    this.actingId.set(booking.id);
    this.bookingApi.accept(booking.id).subscribe({
      next: () => {
        this.toast.success('Booking accepted.');
        this.actingId.set(null);
        this.load();
      },
      error: () => {
        this.actingId.set(null);
        this.toast.error('Could not accept this booking.');
      }
    });
  }

  complete(booking: BookingResponse): void {
    this.actingId.set(booking.id);
    this.bookingApi.complete(booking.id).subscribe({
      next: () => {
        this.toast.success('Booking marked as completed.');
        this.actingId.set(null);
        this.load();
      },
      error: () => {
        this.actingId.set(null);
        this.toast.error('Could not complete this booking.');
      }
    });
  }
}
