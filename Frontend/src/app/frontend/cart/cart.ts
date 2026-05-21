import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cart = signal<any>(null);
  // Store populated product details to show names and images
  cartProducts = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.getUserCart(user.id).subscribe({
      next: (cartData) => {
        this.cart.set(cartData);
        if (cartData && cartData.cartItems.length > 0) {
          this.populateProductDetails(cartData.cartItems);
        } else {
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Cart load error:', err);
        this.isLoading.set(false);
      },
    });
  }

  // Temporary frontend population since backend getUserCart doesn't use .populate()
  populateProductDetails(cartItems: any[]) {
    const productRequests = cartItems.map((item) => this.apiService.getProductById(item.productId));

    forkJoin(productRequests).subscribe({
      next: (products) => {
        const populated = cartItems.map((item, index) => ({
          ...item,
          productDetails: products[index],
        }));
        this.cartProducts.set(populated);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  updateQuantity(productId: string, currentQty: number, change: number) {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    const user = this.authService.currentUser();
    if (!user) return;

    this.apiService.updateCart(user.id, productId, { quantity: newQty }).subscribe({
      next: () => this.loadCart(), // Reload to get fresh totals
      error: (err) => console.error('Failed to update quantity', err),
    });
  }

  removeItem(productId: string) {
    const user = this.authService.currentUser();
    if (!user) return;

    this.apiService.removeCartItem(user.id, productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to remove item', err),
    });
  }
}
