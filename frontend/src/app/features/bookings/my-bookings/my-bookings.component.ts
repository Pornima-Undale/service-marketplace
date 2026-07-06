import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { BookingResponse, BookingStatus } from '../../../core/models/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit {
  bookings = signal<BookingResponse[]>([]);
  loading = signal(true);
  errorMsg = signal<string | null>(null);
  filterStatus = signal<BookingStatus | 'ALL'>('ALL');

  filtered = computed(() => {
    if (this.filterStatus() === 'ALL') return this.bookings();
    return this.bookings().filter(b => b.status === this.filterStatus());
  });

  statusTabs: (BookingStatus | 'ALL')[] = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'];

  constructor(private bookingApi: BookingService) {}

  ngOnInit(): void {
    this.bookingApi.getAll().subscribe({
      next: bookings => { this.bookings.set(bookings); this.loading.set(false); },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Could not load bookings. Please check the backend connection.');
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
}
