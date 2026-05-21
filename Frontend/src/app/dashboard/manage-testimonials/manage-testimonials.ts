import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-manage-testimonials',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-testimonials.html',
})
export class ManageTestimonialsComponent implements OnInit {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  testimonials = signal<any[]>([]);
  isLoading = signal(true);

  // Modal State
  showModal = signal(false);
  private currentEditingId: string | null = null;

  testimonialForm: FormGroup = this.fb.group({
    comment: ['', Validators.required],
    stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    status: ['pending', Validators.required],
  });

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.isLoading.set(true);
    this.apiService.getTestimonials().subscribe({
      next: (res) => {
        this.testimonials.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  // Fast quick-action buttons
  updateStatus(id: string, status: 'approved' | 'refused') {
    const isApproved = status === 'approved';
    this.apiService.updateTestimonialStatus(id, status, isApproved).subscribe({
      next: () => this.loadTestimonials(),
      error: (err) => console.error('Failed to update testimonial', err),
    });
  }

  // Full Edit Modal
  openEditModal(test: any) {
    this.currentEditingId = test._id;
    this.testimonialForm.patchValue({
      comment: test.comment,
      stars: test.stars,
      status: test.status,
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.currentEditingId = null;
  }

  saveTestimonial() {
    if (this.testimonialForm.invalid || !this.currentEditingId) return;

    const payload = {
      ...this.testimonialForm.value,
      isApproved: this.testimonialForm.value.status === 'approved',
    };

    this.apiService.updateTestimonial(this.currentEditingId, payload).subscribe({
      next: () => {
        this.loadTestimonials();
        this.closeModal();
      },
      error: (err) => console.error('Failed to save testimonial', err),
    });
  }

  deleteTestimonial(id: string) {
    if (
      confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')
    ) {
      this.apiService.deleteTestimonial(id).subscribe({
        next: () => this.loadTestimonials(),
        error: (err) => console.error('Failed to delete testimonial', err),
      });
    }
  }
}
