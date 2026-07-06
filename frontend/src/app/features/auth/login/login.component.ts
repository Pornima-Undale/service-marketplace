import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('Welcome back!');
        const role = this.auth.role();
        if (role === 'PROVIDER') this.router.navigate(['/provider/dashboard']);
        else if (role === 'ADMIN') this.router.navigate(['/admin/users']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.status === 401 || err.status === 400 || err.status === 500
          ? 'Invalid email or password.'
          : 'Login failed. Please try again.';
        this.toast.error(msg);
      }
    });
  }
}
