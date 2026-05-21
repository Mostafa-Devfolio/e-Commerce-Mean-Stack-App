import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cart = signal<any>(null);
  isSubmitting = signal(false);

  checkoutForm = this.fb.group({
    addressId: ['', Validators.required], // In a real app, this would be a dropdown of user's saved addresses. We'll use a text input acting as the ID for this phase.
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
  });

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.apiService.getUserCart(user.id).subscribe({
        next: (data) => {
          if (!data || data.cartItems.length === 0) {
            this.router.navigate(['/cart']); // Redirect if cart is empty
          }
          this.cart.set(data);
        },
      });
    }
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    const currentCart = this.cart();
    if (!user || !currentCart) return;

    this.isSubmitting.set(true);

    // Map cart items to the Order schema structure
    const orderProducts = currentCart.cartItems.map((item: any) => ({
      productId: item.productId,
      name: 'Product Name', // Requires backend population or frontend mapping to get actual name
      price: item.priceWhileAdding,
      quantity: item.quantity,
    }));

    const payload = {
      userId: user.id,
      addressId: this.checkoutForm.value.addressId, // Should match an ObjectId in DB
      phoneNumber: Number(this.checkoutForm.value.phoneNumber),
      totalPrice: currentCart.total,
      status: 'pending',
      products: orderProducts,
    };

    this.apiService.createOrder(payload).subscribe({
      next: (res) => {
        alert('Order placed successfully!');
        this.router.navigate(['/orders']); // Navigate to user orders page
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to place order. Ensure AddressId is a valid ObjectId.');
        this.isSubmitting.set(false);
      },
    });
  }
}
