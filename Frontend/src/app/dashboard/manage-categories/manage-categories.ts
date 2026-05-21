import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-categories.html',
})
export class ManageCategoriesComponent implements OnInit {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  categories = signal<any[]>([]);
  isLoading = signal(true);

  showModal = signal(false);
  isEditing = signal(false);
  currentEditingId = signal<string | null>(null);

  categoryForm = this.fb.group({
    title: ['', Validators.required],
    isActive: [true],
    isDeleted: [false],
  });

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading.set(true);
    this.apiService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data || []);
        console.log(this.categories)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch categories', err);
        this.isLoading.set(false);
      },
    });
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentEditingId.set(null);
    this.categoryForm.reset({ isActive: true, isDeleted: false });
    this.showModal.set(true);
  }

  openEditModal(category: any) {
    this.isEditing.set(true);
    this.currentEditingId.set(category._id);
    this.categoryForm.patchValue({
      title: category.title,
      isActive: category.isActive,
      isDeleted: category.isDeleted,
    });
    this.showModal.set(true);
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;

    if (this.isEditing() && this.currentEditingId()) {
      const payload = { categoryId: this.currentEditingId(), ...this.categoryForm.value };
      this.apiService.updateCategory(payload).subscribe({
        next: () => {
          this.loadCategories();
          this.showModal.set(false);
        },
        error: (err) => console.error('Update failed', err),
      });
    } else {
      this.apiService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.loadCategories();
          this.showModal.set(false);
        },
        error: (err) => console.error('Creation failed', err),
      });
    }
  }
}
