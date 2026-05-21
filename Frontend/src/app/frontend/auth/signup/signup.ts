import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Form structured to match your backend userZodSchema
  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{9,11}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    gender: ['male', Validators.required],
    role: ['user'], // Hardcoded so public users can't create admin accounts
  });

  errorMessage = signal('');
  isLoading = signal(false);

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.apiService.signup(this.signupForm.value).subscribe({
      next: () => {
        alert('Account created successfully! Please sign in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        // Extracting backend validation errors if they exist
        this.errorMessage.set(
          err.error?.message || err.error?.errors || 'Registration failed. Please check your data.',
        );
      },
    });
  }
}
