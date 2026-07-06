import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Role } from '../../../core/models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);
  showPassword = signal(false);
  selectedRole = signal<Role>('CUSTOMER');

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get name() { return this.form.get('name')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  selectRole(role: Role): void {
    this.selectedRole.set(role);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const payload = { ...this.form.getRawValue(), role: this.selectedRole() } as any;

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('Account created! Welcome to LocalPro.');
        if (this.selectedRole() === 'PROVIDER') {
          this.router.navigate(['/provider/profile']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Could not create account. That email may already be registered.');
      }
    });
  }
}
