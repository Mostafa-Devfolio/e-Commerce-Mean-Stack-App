import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { User, Address } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.html',
})
export class UserProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  currentUser = signal<User | null>(null);
  addresses = signal<Address[]>([]);

  isLoading = signal(true);
  isSaving = signal(false);

  // Address Modal State
  showAddressModal = signal(false);
  isEditingAddress = signal(false);
  editingAddressIndex = signal<number | null>(null);

  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    mobile: ['', Validators.required],
  });

  addressForm: FormGroup = this.fb.group({
    label: ['home', Validators.required],
    addressText: ['', Validators.required],
    isDefault: [false],
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading.set(true);
    const userId = this.authService.currentUser()?._id;
    if (!userId) return;

    this.apiService.getUser(userId).subscribe({
      next: (res: any) => {
        const user = res.data;
        this.currentUser.set(user);
        this.addresses.set(user.addresses || []);

        this.profileForm.patchValue({
          name: user.name,
          mobile: user.mobile,
        });

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  // --- Profile Info ---
  saveProfileInfo() {
    if (this.profileForm.invalid) return;
    this.isSaving.set(true);

    this.apiService.updateMyProfile(this.profileForm.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        alert('Profile information updated!');
      },
      error: () => this.isSaving.set(false),
    });
  }

  // --- Address Management ---
  openAddAddressModal() {
    this.isEditingAddress.set(false);
    this.editingAddressIndex.set(null);
    this.addressForm.reset({ label: 'home', isDefault: false });
    this.showAddressModal.set(true);
  }

  openEditAddressModal(index: number) {
    this.isEditingAddress.set(true);
    this.editingAddressIndex.set(index);
    const addr = this.addresses()[index];
    this.addressForm.patchValue(addr);
    this.showAddressModal.set(true);
  }

  closeAddressModal() {
    this.showAddressModal.set(false);
  }

  saveAddress() {
    if (this.addressForm.invalid) return;

    const newAddress = this.addressForm.value;
    let currentAddresses = [...this.addresses()];

    // If new address is set to default, remove default from others
    if (newAddress.isDefault) {
      currentAddresses = currentAddresses.map((a) => ({ ...a, isDefault: false }));
    }

    if (this.isEditingAddress() && this.editingAddressIndex() !== null) {
      currentAddresses[this.editingAddressIndex() as number] = newAddress;
    } else {
      // If it's the very first address, make it default automatically
      if (currentAddresses.length === 0) newAddress.isDefault = true;
      currentAddresses.push(newAddress);
    }

    this.syncAddresses(currentAddresses);
    this.closeAddressModal();
  }

  removeAddress(index: number) {
    if (!confirm('Are you sure you want to remove this address?')) return;

    let currentAddresses = [...this.addresses()];
    const removed = currentAddresses.splice(index, 1)[0];

    // If we removed the default address, and others exist, make the first one default
    if (removed.isDefault && currentAddresses.length > 0) {
      currentAddresses[0].isDefault = true;
    }

    this.syncAddresses(currentAddresses);
  }

  setDefaultAddress(index: number) {
    let currentAddresses = [...this.addresses()].map((a, i) => ({
      ...a,
      isDefault: i === index,
    }));
    this.syncAddresses(currentAddresses);
  }

  private syncAddresses(updatedAddresses: Address[]) {
    this.addresses.set(updatedAddresses);
    this.apiService.updateMyProfile({ addresses: updatedAddresses }).subscribe({
      next: () => console.log('Address book synced'),
      error: (err) => console.error('Failed to sync addresses', err),
    });
  }
}
