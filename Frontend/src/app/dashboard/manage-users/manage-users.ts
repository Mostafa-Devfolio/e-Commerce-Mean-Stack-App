import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { User } from './../../core/interfaces/user.interface';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-users.html',
})
export class ManageUsersComponent implements OnInit {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  users = signal<User[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isEditing = signal(false);
  private currentEditingId: string | null = null;

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''], // Add this!
    mobile: ['', [Validators.required, Validators.minLength(9)]],
    role: ['user', Validators.required],
    isActive: [true],
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.apiService.getUsers().subscribe({
      next: (res) => {
        this.users.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentEditingId = null;
    // Make password required only when adding new
    this.userForm.controls['password'].setValidators([
      Validators.required,
      Validators.minLength(6),
    ]);
    this.userForm.reset({ role: 'user', isActive: true });
    this.showModal.set(true);
  }

  openEditModal(user: User) {
    this.isEditing.set(true);
    this.currentEditingId = user._id;
    // Clear password requirement when editing (so you don't have to change it every time)
    this.userForm.controls['password'].clearValidators();
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.currentEditingId = null;
  }

  saveUser() {
    if (this.userForm.invalid) return;

    if (this.isEditing() && this.currentEditingId) {
      this.apiService.updateUser(this.currentEditingId, this.userForm.value).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    } else {
      this.apiService.signup(this.userForm.value).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    }
  }

  deleteUser(id: string) {
    if (confirm('Delete this user?')) {
      this.apiService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
