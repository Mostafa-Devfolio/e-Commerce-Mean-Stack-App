import { Product } from './../../core/interfaces/user.interface';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products-details.html',
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  product = signal<Product | null>(null);
  quantity = signal<number>(1);
  isLoading = signal(true);
  isAdding = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getProductById(id).subscribe({
        next: (res) => {
          this.product.set(res || null);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    }
  }

  addToCart() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const currentProduct = this.product();
    if (!currentProduct) return;

    this.isAdding.set(true);

    const payload = {
      userId: currentUser.id,
      cartItems: [
        {
          productId: currentProduct._id,
          quantity: this.quantity(),
          priceWhileAdding: currentProduct.price,
          totalPrice: currentProduct.price * this.quantity(),
          isPriceChanged: false,
        },
      ],
      total: currentProduct.price * this.quantity(),
    };

    this.apiService.addToCart(payload).subscribe({
      next: () => {
        alert('Product added to cart!');
        this.isAdding.set(false);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add to cart.');
        this.isAdding.set(false);
      },
    });
  }
}
