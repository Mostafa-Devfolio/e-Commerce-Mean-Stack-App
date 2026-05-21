import { Product } from './../../core/interfaces/user.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-products.html',
})
export class ManageProductsComponent implements OnInit {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  isLoading = signal(true);

  // Modal State
  showModal = signal(false);
  isEditing = signal(false);
  currentEditingId = signal<string | null>(null);

  productForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    image: [''],
    stock: [1, [Validators.required, Validators.min(0)]],
    isActive: [true],
    isDeleted: [false],
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.apiService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading.set(false);
      },
    });
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentEditingId.set(null);
    this.productForm.reset({ stock: 1, isActive: true, isDeleted: false });
    this.showModal.set(true);
  }

  openEditModal(product: Product) {
    this.isEditing.set(true);
    if (product._id) {
      this.currentEditingId.set(product._id);
    }
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
      isActive: product.isActive,
      isDeleted: product.isDeleted,
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    const formData = this.productForm.value as any;

    if (this.isEditing() && this.currentEditingId()) {
      this.apiService.updateProduct(this.currentEditingId()!, formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => console.error('Update failed', err),
      });
    } else {
      this.apiService.createProduct(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => console.error('Creation failed', err),
      });
    }
  }
}
