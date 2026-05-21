import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

export interface Category {
  _id: string;
  title: string;
}

export interface Subcategory {
  _id: string;
  title: string;
  categoryId: string; // Updated from your model
  category?: Category; // Optional helper for display
  isActive: boolean;
  isDeleted: boolean;
}

@Component({
  selector: 'app-manage-subcategories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-subcategories.html',
})
export class ManageSubcategories implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  subcategories = signal<Subcategory[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);
  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);

  private currentEditingId: string | null = null;

  subCategoryForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    categoryId: ['', Validators.required], // Matches backend model field
    isActive: [true],
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    // Use the apiService for both calls
    Promise.all([
      this.apiService.getSubcategories().toPromise(),
      this.apiService.getCategories().toPromise(),
    ])
      .then(([subs, cats]) => {
        // Map the subcategories to include category title for display
        const categoryList = cats?.data || [];
        this.categories.set(categoryList);

        const subList = (subs || []).map((sub: any) => ({
          ...sub,
          category: categoryList.find((c: any) => c._id === sub.categoryId),
        }));

        this.subcategories.set(subList);
        this.isLoading.set(false);
      })
      .catch((err) => {
        console.error('Error loading data', err);
        this.isLoading.set(false);
      });
  }

  // 1. Ensure categories are always loaded
  openAddModal(): void {
    this.isEditing.set(false);
    this.currentEditingId = null;
    this.subCategoryForm.reset({
      isActive: true,
      categoryId: '', // Ensure this matches formControlName
    });

    // If categories list is empty, fetch it again immediately
    if (this.categories().length === 0) {
      this.apiService.getCategories().subscribe((res) => this.categories.set(res.data || []));
    }

    this.showModal.set(true);
  }

  openEditModal(sub: Subcategory): void {
    this.isEditing.set(true);
    this.currentEditingId = sub._id;

    // Ensure we have categories before patching
    if (this.categories().length === 0) {
      this.apiService.getCategories().subscribe((res) => this.categories.set(res.data || []));
    }

    this.subCategoryForm.patchValue({
      title: sub.title,
      categoryId: sub.categoryId,
      isActive: sub.isActive,
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveSubCategory(): void {
    // 1. Mark as touched so validation messages appear if invalid
    if (this.subCategoryForm.invalid) {
      this.subCategoryForm.markAllAsTouched();
      return;
    }

    // 2. Explicitly extract values
    const formValue = this.subCategoryForm.getRawValue();

    const payload = {
      title: formValue.title,
      categoryId: formValue.categoryId,
      // !! ensures it is a strict boolean true/false, not null/undefined
      isActive: !!formValue.isActive,
    };

    if (this.isEditing() && this.currentEditingId) {
      this.apiService.updateSubcategory(this.currentEditingId, payload).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    } else {
      this.apiService.createSubcategory(payload).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    }
  }

  deleteSubcategory(id: string): void {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      this.apiService.deleteSubcategory(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}
