import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss'
})
export class AdminCategoriesComponent {
  private categoryApi = inject(CategoryService);
  private toast = inject(ToastService);

  newCategoryName = '';
  loading = signal(false);

  categories = this.categoryApi.categories;

  submit(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    this.loading.set(true);
    this.categoryApi.create(name).subscribe({
      next: category => {
        this.loading.set(false);
        this.newCategoryName = '';
        this.toast.success(`Category "${category.name}" created.`);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Could not create category. It may already exist.');
      }
    });
  }
}
