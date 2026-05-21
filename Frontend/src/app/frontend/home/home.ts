import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
// Assuming your AuthService handles currentUser state
import { AuthService } from '../../core/services/auth.service';
import { DatePipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from './../../core/interfaces/user.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  public authService = inject(AuthService); // Public so HTML can read it
  private fb = inject(FormBuilder);

  // Using signals for reactive data binding
  featuredProducts = signal<Product[]>([]);
  featuredCategories = signal<any[]>([]);
  approvedTestimonials = signal<any[]>([]);
  isLoading = signal(true);

  // Feedback message after form submission
  submissionMessage = signal<string | null>(null);

  // Testimonial Form
  testimonialForm: FormGroup = this.fb.group({
    comment: ['', [Validators.required, Validators.minLength(10)]],
    stars: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  ngOnInit() {
    this.fetchHomeData();
  }

  fetchHomeData() {
    this.isLoading.set(true);

    // 1. Fetch Products
    this.apiService.getProducts().subscribe({
      next: (res) => this.featuredProducts.set(res.data?.slice(0, 4) || []),
      error: (err) => console.error('Failed to load products', err),
    });

    // 2. Fetch Categories
    this.apiService.getCategories().subscribe({
      next: (res) => this.featuredCategories.set(res.data?.slice(0, 3) || []),
      error: (err) => console.error('Failed to load categories', err),
    });

    // 3. Fetch Testimonials & Filter for 'approved' ONLY
    this.apiService.getTestimonials().subscribe({
      next: (res) => {
        const approved = (res.data || []).filter((test: any) => test.status === 'approved');
        this.approvedTestimonials.set(approved);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load testimonials', err);
        this.isLoading.set(false);
      },
    });
  }

  submitTestimonial() {
    console.log('--- Testimonial Submission Triggered ---');

    // 1. Check form validity
    if (this.testimonialForm.invalid) {
      console.warn('Form is invalid! Check constraints.');
      this.testimonialForm.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    console.log('Current User Object:', user);

    // 2. Check for both _id and id (handles Mongoose vs JWT payload differences)
    const userId = user?._id || user?.id;

    if (!userId) {
      console.error('CRITICAL: User ID is missing! Cannot attach testimonial to a user.');
      this.submissionMessage.set(
        'Error: Could not verify your account. Please try logging out and logging back in.',
      );
      return;
    }

    // 3. Construct the payload
    const payload = {
      userId: userId, // Safely extracted ID
      comment: this.testimonialForm.value.comment,
      stars: Number(this.testimonialForm.value.stars),
    };

    console.log('Sending Payload:', payload);

    // 4. Send to backend
    this.apiService.createTestimonial(payload).subscribe({
      next: (res) => {
        console.log('Success Response:', res);
        this.submissionMessage.set(
          'Thank you! Your testimonial has been submitted and is pending review by our team.',
        );
        this.testimonialForm.reset({ stars: 5 }); // Reset form to default
      },
      error: (err) => {
        console.error('Backend Error:', err);
        this.submissionMessage.set('Oops! Something went wrong while submitting.');
      },
    });
  }
}
