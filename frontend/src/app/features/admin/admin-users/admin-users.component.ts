import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserResponse } from '../../../core/models/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  users = signal<UserResponse[]>([]);
  loading = signal(true);
  errorMsg = signal<string | null>(null);
  deletingId = signal<number | null>(null);

  constructor(private userApi: UserService, private toast: ToastService, public auth: AuthService) {}

  ngOnInit(): void {
    this.userApi.getAll().subscribe({
      next: users => { this.users.set(users); this.loading.set(false); },
      error: () => { this.loading.set(false); this.errorMsg.set('Could not load users.'); }
    });
  }

  deleteUser(user: UserResponse): void {
    if (user.email === this.auth.currentUser()?.email) {
      this.toast.error("You can't delete your own account here.");
      return;
    }
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    this.deletingId.set(user.id);
    this.userApi.delete(user.id).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.id !== user.id));
        this.deletingId.set(null);
        this.toast.success('User deleted.');
      },
      error: () => {
        this.deletingId.set(null);
        this.toast.error('Could not delete this user.');
      }
    });
  }

  roleBadgeClass(role: string): string {
    return role === 'ADMIN' ? 'badge-cancelled' : role === 'PROVIDER' ? 'badge-accepted' : 'badge-role';
  }
}
